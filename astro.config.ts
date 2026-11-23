// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

import { satteri } from "@astrojs/markdown-satteri";
import starlight from "@astrojs/starlight";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import type { AstroUserConfig } from "astro";
import { defineConfig } from "astro/config";
import starlightLinksValidator from "starlight-links-validator";
import starlightLlmsTxt from "starlight-llms-txt";
import starlightScrollToTop from "starlight-scroll-to-top";
import starlightThemeRapide from "starlight-theme-rapide";
import { externalLinksPlugin } from "./support/astro/external-links";
import { relativeLinksPlugin } from "./support/astro/relative-links";

// https://astro.build/config
export default defineConfig({
    site: "https://open-pioneer.dev",
    markdown: {
        processor: satteri({
            hastPlugins: [relativeLinksPlugin(""), externalLinksPlugin()]
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
            customCss: ["./src/styles/custom.css"],
            social: [
                {
                    icon: "github",
                    label: "Open Pioneer on GitHub",
                    href: "https://github.com/open-pioneer"
                }
            ],
            components: {
                // Adds the "Docs" link to the header, next to the social icons.
                SocialIcons: "./src/components/overrides/social-icons.astro",
                // Adds an invisible link to llms.txt at the top of every page, for AI agents.
                Banner: "./src/components/overrides/banner.astro",
                // Adds the "work in progress" notice above the header, and the site footer
                // with legal/security policy links below it, on every page.
                PageFrame: "./src/components/overrides/page-frame.astro"
            },
            sidebar: [
                {
                    label: "Documentation",
                    items: [
                        // Slugs instead of { label, link }: the label is taken from the page title.
                        "trails-docs",
                        "trails-docs/GettingStarted",
                        "trails-docs/RepositoryGuide",
                        "trails-docs/Contributing",
                        "trails-docs/BestPractices",
                        "trails-docs/WaysToPatchAPackage",
                        "trails-docs/Glossary",
                        {
                            label: "Tutorials",
                            collapsed: true,
                            items: [{ autogenerate: { directory: "trails-docs/tutorials" } }]
                        },
                        {
                            label: "Reference",
                            collapsed: true,
                            items: [{ autogenerate: { directory: "trails-docs/reference" } }]
                        }
                    ]
                }
            ],
            editLink: {
                baseUrl: "https://github.com/open-pioneer/website/edit/main/"
            },
            plugins: [
                starlightThemeRapide(),
                starlightScrollToTop(),
                starlightLinksValidator({
                    // The tutorials document the URLs of the local dev server, they are content
                    // rather than navigation.
                    errorOnLocalLinks: false
                }),
                starlightLlmsTxt({
                    promote: ["index*", "*GettingStarted*"],
                    // Keep line breaks: the minifier breaks the markdown structure for some documents (huge headings containing too much text).
                    minify: { whitespace: false },
                    customSelectors: {
                        all: [
                            // Starlight's heading anchors would otherwise appear as "[Section titled ...](#...)" links throughout the output.
                            "a.sl-anchor-link",
                            // Exclude line numbers from code blocks (see pluginLineNumbers() below).
                            "div.gutter"
                        ]
                    },
                    // Note: only removes from llms-small.txt
                    exclude: ["trails-docs/internals/**", "trails-docs/research/**"]
                })
            ],
            expressiveCode: {
                plugins: [pluginLineNumbers()]
            }
        })
    ]
} satisfies AstroUserConfig);
