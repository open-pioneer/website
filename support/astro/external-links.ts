// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

import { type HastPluginDefinition } from "satteri";

const EXTERNAL_HREF = /^(?:https?:)?\/\//i;

/**
 * Opens external links in a new tab and marks them with a trailing "↗".
 */
export function externalLinksPlugin(): HastPluginDefinition {
    return {
        name: "external-links",
        element: {
            filter: ["a"],
            visit(node, ctx) {
                const href = node.properties?.href;
                if (typeof href !== "string" || !EXTERNAL_HREF.test(href)) {
                    return;
                }

                ctx.setProperty(node, "target", "_blank");
                ctx.setProperty(node, "rel", ["noopener", "noreferrer"]);
                ctx.appendChild(node, [
                    {
                        type: "element",
                        tagName: "span",
                        properties: { ariaHidden: "true" },
                        children: [{ type: "text", value: " ↗" }]
                    },
                    {
                        type: "element",
                        tagName: "span",
                        // Reuse screen-reader-only class from astro.
                        // Keep the warning out of the Pagefind search index, as Starlight does.
                        properties: { className: ["sr-only"], dataPagefindIgnore: "" },
                        children: [{ type: "text", value: " (opens in a new tab)" }]
                    }
                ]);
            }
        }
    };
}
