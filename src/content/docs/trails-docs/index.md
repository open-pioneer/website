---
title: Introduction
---

The Open Pioneer Trails framework supports the creation of client-side web applications.
It offers a simple architecture where an application can be assembled from a set of packages.
Packages are reusable components that can be used in multiple applications and with different configurations.
When an application is built, it can be deployed as a single-page or multi-page application, or as a Web Component that is embedded in another site.

To get started developing an application, head over to [Getting Started](./GettingStarted.md).

## Technology Stack

This project is built on these open source projects:

- [Vite](https://vitejs.dev/) is used as the development environment and application bundler.
- [Vitest](https://vitest.dev/) runs our tests.
- [React](https://reactjs.org/) provides the foundation of our UI.
- We use accessible UI components from [Chakra UI](https://chakra-ui.com/).
- Applications can support multiple languages by using [FormatJS](https://formatjs.io/).
- Framework code is written in [TypeScript](https://www.typescriptlang.org/).
  We recommend, but do not require, TypeScript for application code as well.
- [pnpm](https://pnpm.io/) is our package manager.
- Applications are shipped as [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components).

## Further Reading

More information about the underlying design decisions, build process, and repository guidelines
is available in the [Core Packages repository](https://github.com/open-pioneer/trails-core-packages/tree/main/docs/internals).
It also includes [guidance](https://github.com/open-pioneer/trails-core-packages/blob/main/docs/internals/ChakraV3Migration.md) for migrating older Open Pioneer Trails applications from Chakra UI v2 to v3.
