---
title: Best practices and common issues
slug: trails-docs/BestPractices
---

## Best practices

### Logging

The framework provides a logger for standardized application wide logging.
The log level is configured globally in the `vite.config.ts`.

We recommend using this logger for all log messages to keep logging uniform.
This is especially helpful if the log level is changed or the logger should be
replaced with a new implementation later on.

To create a logger instance, call the `createLogger` function.
It takes a prefix (string) to prepend to each message.
In most cases, you can generate the log prefix using the `open-pioneer:source-info` module:

```ts
// packageName/foo.ts
import { createLogger } from "@open-pioneer/core";
import { sourceId } from "open-pioneer:source-info";

const LOG = createLogger(sourceId);
LOG.warn("example message", { testLog: 123, text: "this is a text" });
```

The `sourceId` is derived from the current file (`packageName/foo` in this case).
You can also define a custom logging prefix instead of `sourceId`.

The logger provides log methods for the following log levels with the following order: DEBUG < INFO < WARN < ERROR.

Hint: If you're using the logger instead of the browser's builtin console, the original trace is usually lost.
However, in Chrome you can see the trace for error and warning messages by clicking on the message title.
In Firefox this only seems to work for error messages.

### HTTP requests

Use the central `http.HttpService` (see [@open-pioneer/http](https://www.npmjs.com/package/@open-pioneer/http)) to perform HTTP requests.
The service exposes the method `fetch()` which is compatible with (and implemented in terms of) the browser's modern [`fetch()` function](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

Using a central method is important for future proofing our development.
We might add new features such as automatic authentication (e.g. tokens) or automatic proxy support which users of the `HttpService`
can then automatically take advantage of.

### Dependency management

(p-)npm packages support multiple different kinds of dependencies in their `package.json`: `dependencies`, `peerDependencies`, `devDependencies` and `optionalDependencies` (although we will skip the latter one as it is only rarely used).

When developing locally in the context of an app and "local" packages, you can often get away with being imprecise about your package's dependencies - things will often "just work".
In this case, it is "just" a good practice to be precise in your dependency management.
When you're developing shared packages (e.g. published on npmjs.com), good dependency management becomes critical, or your code will not work when used by other developers.

When thinking about dependencies, follow these general guidelines:

- When referencing a tool used all over your repository (such as `oxfmt` or `@open-pioneer/vite-plugin-pioneer`),
  declare it as a `devDependency` in your project's root `package.json`.
  This way you don't have to duplicate the dependency in every package of your workspace.

- When requiring functionality at runtime (e.g. `import ...`) from a source file in an app or package,
  add the other package in your own `package.json` as either `dependency` or `peerDependency`.
  The `build-pioneer-package` tool enforces this rule.

    Example:

    ```jsonc
    {
        "name": "my-package",
        "dependencies": {
            "other-package": "^1.2.3"
        }
    }
    ```

- Use "open" specifiers for dependencies like `^`.
  Not depending on a fixed version avoids conflicts if multiple packages prefer slightly different versions.

For information about version handling of Trails packages, see [Version Overview](./reference/Versions.md).

#### dependencies vs peerDependencies

[This post](https://indepth.dev/posts/1187/npm-peer-dependencies) is a great explainer for the differences between `dependencies` and `peerDependencies`.
See also npm's [reference documentation](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#peerdependencies).

Both `dependencies` and `peerDependencies` refer to packages required at runtime, but `dependencies` will be duplicated when incompatible versions are required, whereas `peerDependencies` will report an error should that be the case.
Although `peerDependencies` look like the correct solution on paper, they have some annoying limitations in current versions of pnpm.
For example, transitive dependencies (peer dependencies of peer dependencies) are sometimes not updated correctly, even though all users of those packages request newer versions.
**For this reason, we currently prefer to use `dependencies`.**

To enforce that only a single version of a package is present (a builtin feature of peer dependencies), we use a custom CLI tool instead (see [`pnpm check-duplicates`](./RepositoryGuide.md#pnpm-check-duplicates)).

#### Useful helpers

- `pnpm why DEP` from an app's or package's directory can show why a certain version of a package is present in your dependency tree.

    For example:

    ```bash
    # Show why ol@^9 is present in the dependency tree (-r inspects all packages in the workspace)
    $ pnpm why -r ol@^9
    ```

- `pnpm ls` can show the dependency tree of a package or app (see also the `--depth` option).
- `pnpm dedupe` works hard to de-duplicate packages wherever possible.
- `pnpm update`, e.g. with the `-r` flag, is useful to update dependencies.

### Reactive state

State that is shared between services and UI components should be stored in signals by default.
Signals are provided by the reactivity API [`@conterra/reactivity-core`](https://www.npmjs.com/package/@conterra/reactivity-core).
A signal holds a value and notifies its users when the value changes.

All reactive interfaces of Trails packages (for example the map model) are implemented with this API.
Projects should implement their reactive APIs in the same way for consistency: a single state handling mechanism prevents confusion.
However, this is not an absolute rule: certain specialized scenarios may make it necessary to implement custom state management.

Use `reactive()` for state and `computed()` for values that are derived from other signals.
For example, a basic reactive model class might look like this:

```ts
import { computed, reactive } from "@conterra/reactivity-core";

class Person {
    #firstName = reactive("John");
    #lastName = reactive("Doe");
    #fullName = computed(() => `${this.#firstName.value} ${this.#lastName.value}`);

    get firstName() {
        return this.#firstName.value;
    }
    set firstName(value: string) {
        this.#firstName.value = value;
    }

    get fullName() {
        return this.#fullName.value;
    }
}
```

Users of the class do not need to know about the signals: every getter that reads a signal is reactive.

To perform a side effect when a value changes, use `watchValue()` (or `watch()` and `effect()`):

```ts
import { watchValue } from "@conterra/reactivity-core";

const person = new Person();
const handle = watchValue(
    () => person.fullName,
    (fullName) => {
        console.log(`Name changed to ${fullName}`);
    }
);

person.firstName = "Jane"; // the callback is called asynchronously

handle.destroy(); // don't forget to stop watching during cleanup
```

For more details, read the [README](https://github.com/conterra/reactivity/blob/main/packages/reactivity-core/README.md) of the `reactivity-core` package.

#### Reactive state in React components

React components read reactive values with the hooks from the package [`@open-pioneer/reactivity`](https://www.npmjs.com/package/@open-pioneer/reactivity).
The most important hook is `useReactiveSnapshot()`:

```tsx
import { useReactiveSnapshot } from "@open-pioneer/reactivity";

interface GreetingProps {
    person: Person;
}

function Greeting({ person }: GreetingProps) {
    const fullName = useReactiveSnapshot(() => person.fullName, [person]);
    return <div>Hello {fullName}</div>;
}
```

The component is rendered again when a signal that was read in the callback changes.
The second argument lists the non-reactive values used by the callback (props, services, React state), like the dependencies of `useMemo()` or `useEffect()`.

Always read reactive values through one of these hooks.
A reactive value that is read directly in the body of a component is not tracked, so the component shows a stale value:

```tsx
// Wrong: the component does not update when the name changes
return <div>Hello {person.fullName}</div>;
```

For more details, see:

- [README of `@conterra/reactivity-core`](https://github.com/conterra/reactivity/tree/main/packages/reactivity-core#readme)
- [README of `@open-pioneer/reactivity`](https://github.com/open-pioneer/trails-core-packages/tree/main/src/packages/reactivity#readme)

### Event handling

We currently do not have a global event bus.
Instead, use the package [`@conterra/reactivity-events`](https://www.npmjs.com/package/@conterra/reactivity-events) to implement events that can be subscribed to.
Each event is an emitter that is stored as a property of the object that emits it.

For example:

```ts
import { emit, emitter, on } from "@conterra/reactivity-events";

interface ClickEvent {
    x: number;
    y: number;
}

class View {
    readonly clicked = emitter<ClickEvent>();
}

const view = new View();

// Subscribe to the event
const handle = on(view.clicked, (event) => {
    console.log(`Click at ${event.x}, ${event.y}`);
});

// Emit the event. Subscribers are called asynchronously.
emit(view.clicked, { x: 1, y: 2 });

handle.destroy(); // don't forget to unsubscribe during cleanup
```

> NOTE: The `EventEmitter` class from `@open-pioneer/core` is deprecated.
> Use `@conterra/reactivity-events` instead.

## Development Setup

### Debugging Vitest

#### IntelliJ IDEA

In IntelliJ IDEA the debugging of Vitest tests in monorepos may lead to problems.
However, it is possible to define a custom run configuration to enable debugging:

- In IntelliJ open the "Run/Debug Configurations" dialog ("Run" --> "Edit Configurations").
- Create a new configuration by clicking the "+" icon in the upper left.
- Select "Node.js" from the new configuration list.
- Choose a name (e.g. "Vitest") and ensure that the node interpreter (node.exe) and working directory
  (Trails project root path) are set correctly.
- In the field "JavaScript file" add the path to vitest.mjs (e.g. `./node_modules/vitest/vitest.mjs`)
- In the field "Application parameters" add the following: `run --threads false --testTimeout 30000 <Relative path to your test file>`. The `testTimeout` is optional, however useful for long-running tests. Example: `run --threads false --testTimeout 30000 src/packages/legend/Legend.test.tsx`
- Click "save". Run the new configuration in debug mode to start debugging.

Official information for debugging Vitest in IntelliJ IDEA can be found in the [Vitest documentation](https://vitest.dev/guide/debugging#intellij-idea).

## Common issues

### Services are not started

Only referenced services will be constructed.
If a service does not provide any interfaces, or if the service is never referenced (either by the UI or by another service), the service will not be started.

If absolutely necessary, you can force a service to start even if it's not referenced by anyone by providing the `runtime.AutoStart` interface, see [how to create a service](./tutorials/HowToCreateAService.md#service-autostart).

### Hot reloading of `.jsx`/`.tsx` files and side effects

Vite will automatically hot reload `.jsx` and `.tsx` files when they are being edited.
Most changes to React components can then be applied without reloading the page.

However, during hot reload, the containing module will be executed again.
It should therefore be free of side effects at the module level.

This might be a problem if a `.jsx` or `.tsx` file defines a Web Component (via `customElements.define(...)`) because redefining a Web Component is an error.

There are two recommendations to avoid problems:

1. As a general rule, try to keep your `.jsx` and `.tsx` modules free of side effects.
2. Don't use `app.tsx` or `app.jsx` during development.
   Instead, use a plain `app.ts` or `app.js` and put the React UI in a different file.
