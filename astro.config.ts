// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

import { satteri, type SatteriProcessorOptions } from "@astrojs/markdown-satteri";
import starlight from "@astrojs/starlight";
import type { AstroUserConfig } from "astro";
import { defineConfig } from "astro/config";
import starlightLinksValidator from "starlight-links-validator";
import starlightLlmsTxt from "starlight-llms-txt";
import starlightScrollToTop from "starlight-scroll-to-top";
import starlightThemeRapide from "starlight-theme-rapide";

// https://astro.build/config
export default defineConfig({
    // TODO
    site: "https://open-pioneer.github.io",
    base: "/website",
    markdown: {
        processor: satteri({
            hastPlugins: [externalLinksPlugin()]
        })
    },
    integrations: [
        starlight({
            title: "Open Pioneer Trails",
            // The browser favicon is served separately from `public/favicon.svg`
            // (Starlight emits it as a plain href, so it cannot be a bundled asset).
            logo: {
                src: "./src/assets/logo.svg"
            },
            social: [
                {
                    icon: "github",
                    label: "Open Pioneer on GitHub",
                    href: "https://github.com/open-pioneer"
                }
            ],
            components: {
                // Adds the "Docs" link to the header, next to the social icons.
                SocialIcons: "./src/components/social-icons.astro",
                // Adds an invisible link to llms.txt at the top of every page, for AI agents.
                Banner: "./src/components/banner.astro",
                // Adds the "work in progress" notice above the header on every page.
                PageFrame: "./src/components/page-frame.astro"
            },
            sidebar: [
                {
                    label: "Technical documentation",
                    items: [
                        { label: "Table of contents", link: "/trails-docs/" },
                        { label: "Introduction", link: "/trails-docs/Introduction" },
                        { label: "Getting started", link: "/trails-docs/GettingStarted" },
                        { label: "Repository guide", link: "/trails-docs/RepositoryGuide" },
                        { label: "Contribution guide", link: "/trails-docs/Contributing" },
                        {
                            label: "Tutorials",
                            collapsed: true,
                            items: [{ autogenerate: { directory: "trails-docs/tutorials" } }]
                        },
                        { label: "Best practices", link: "/trails-docs/BestPractices" },
                        {
                            label: "Ways to patch a package",
                            link: "/trails-docs/WaysToPatchAPackage"
                        },
                        {
                            label: "Reference",
                            collapsed: true,
                            items: [{ autogenerate: { directory: "trails-docs/reference" } }]
                        },
                        {
                            label: "Internal documentation",
                            collapsed: true,
                            items: [
                                { autogenerate: { directory: "trails-docs/internals" } },
                                { autogenerate: { directory: "trails-docs/research" } }
                            ]
                        }
                    ]
                }
            ],
            plugins: [
                starlightThemeRapide(),
                starlightScrollToTop(),
                // TODO: starlightLinksValidator(),
                starlightLlmsTxt({
                    promote: ["index*", "*GettingStarted*"],
                    // Keep line breaks: the minifier breaks the markdown structure for some documents (huge headings containing too much text).
                    minify: { whitespace: false },
                    // Starlight's heading anchors would otherwise appear as "[Section titled ...](#...)" links throughout the output.
                    customSelectors: { all: ["a.sl-anchor-link"] },
                    // Note: only removes from llms-small.txt
                    exclude: ["trails-docs/internals/**", "trails-docs/research/**"]
                })
            ]
        })
    ]
} satisfies AstroUserConfig);

type HastPlugin = NonNullable<SatteriProcessorOptions["hastPlugins"]>[number];

/** Absolute or protocol relative http(s) URLs, i.e. links that leave this site. */
const EXTERNAL_HREF = /^(?:https?:)?\/\//i;

/**
 * Opens external links in a new tab and marks them with a trailing "↗".
 */
function externalLinksPlugin(): HastPlugin {
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
