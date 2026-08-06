// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

import type { HastPluginDefinition } from "satteri";

/** Content collection the documentation is rendered from. */
const DOCS_ROOT = "/src/content/docs/";

/** A link to another document: a path ending in `.md` or `.mdx`, plus an optional query and fragment. */
const DOCUMENT_HREF = /^(?<path>[^?#]*\.mdx?)(?<suffix>[?#].*)?$/i;

/** Trailing `.md` or `.mdx` of a document, which is not part of its URL. */
const DOCUMENT_EXTENSION = /\.mdx?$/i;

/** A document named `index`, which is served as the URL of its directory. */
const DOCUMENT_INDEX = /(^|\/)index$/i;

/**
 * Rewrites links to other documents (`./Foo.md`, `../bar/Foo.md#section`) to the URL of the page
 * that document is rendered as.
 *
 * This is important because it lets us use relative links while still using the starlight links validator,
 * which needs absolute links at build time.
 */
export function relativeLinksPlugin(base: string): HastPluginDefinition {
    return {
        name: "relative-links",
        element: {
            filter: ["a"],
            visit(node, ctx) {
                const href = node.properties?.href;
                if (typeof href !== "string" || !ctx.fileURL) {
                    return;
                }

                const url = resolveDocumentUrl(href, ctx.fileURL, base);
                if (url) {
                    ctx.setProperty(node, "href", url);
                }
            }
        }
    };
}

/**
 * Resolves a link to another document against the document at `fileURL`, e.g. `./RepositoryGuide.md`
 * in `trails-docs/GettingStarted.md` becomes `/${base}/trails-docs/RepositoryGuide/`.
 *
 * Returns `undefined` for anything that is not a document in this collection, such as links to an
 * asset or to a file outside of the documentation.
 */
function resolveDocumentUrl(href: string, fileURL: URL, base: string): string | undefined {
    const { path, suffix = "" } = DOCUMENT_HREF.exec(href)?.groups ?? {};
    if (!path) {
        return undefined;
    }

    const target = new URL(path, fileURL);
    const docsRootIndex = target.protocol === "file:" ? target.pathname.indexOf(DOCS_ROOT) : -1;
    if (docsRootIndex === -1) {
        return undefined;
    }

    const id = target.pathname
        .slice(docsRootIndex + DOCS_ROOT.length)
        .replace(DOCUMENT_EXTENSION, "")
        .replace(DOCUMENT_INDEX, "");
    return `${base}/${id}${id ? "/" : ""}${suffix}`;
}
