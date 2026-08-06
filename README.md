# Open Pioneer Trails website

[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)

The website and technical documentation for
[Open Pioneer Trails](https://github.com/open-pioneer), built with
[Astro](https://astro.build) and [Starlight](https://starlight.astro.build).

## Project structure

```
.
├── public/                 # Static assets, served as-is
├── src/
│   ├── assets/             # Images embedded in Markdown
│   ├── components/         # Astro components
│   ├── content/
│   │   └── docs/           # Page content
│   └── content.config.ts   # Content collection definitions
├── astro.config.ts         # Astro and Starlight configuration
├── oxfmt.config.ts         # Formatter configuration
├── oxlint.config.ts        # Linter configuration
├── package.json
└── tsconfig.json
```

Starlight renders every `.md` and `.mdx` file under `src/content/docs/` as a page,
using the file path as the route. The sidebar is configured in `astro.config.ts`.

`src/content/docs/trails-docs/` mirrors the technical documentation maintained in the
Trails repositories. Do not edit those files here; change them upstream instead.

TODO:

- Move from trails-starter to this website.
- Create llms.txt to link to the markdown files (for humans! there is already an invisible link on every site)

## Commands

Run all commands from the root of the project:

| Command          | Action                                                     |
| :--------------- | :--------------------------------------------------------- |
| `pnpm install`   | Install dependencies                                       |
| `pnpm dev`       | Start the development server at `localhost:4321`           |
| `pnpm build`     | Build the production site to `./dist/`                     |
| `pnpm preview`   | Preview the production build locally                       |
| `pnpm lint`      | Lint the sources (`pnpm lint:fix` applies automatic fixes) |
| `pnpm fmt`       | Format the sources (`pnpm fmt:check` only reports)         |
| `pnpm astro ...` | Run Astro CLI commands, for example `astro check`          |

## Learn more

- [Starlight documentation](https://starlight.astro.build/)
- [Astro documentation](https://docs.astro.build)
- [Astro Discord server](https://astro.build/chat)
