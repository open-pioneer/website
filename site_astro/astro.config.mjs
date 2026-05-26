// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import rehypeExternalLinks from 'rehype-external-links';
import starlightThemeRapide from 'starlight-theme-rapide'

// https://astro.build/config
export default defineConfig({
	markdown: {
		rehypePlugins: [
			[
				rehypeExternalLinks,
				{
					target: '_blank',
					rel: ['noopener', 'noreferrer'],
					content: {
						type: 'text',
						value: ' ↗',
					},
				},
			],
		],
	},
	integrations: [
		starlight({
			plugins: [starlightThemeRapide()],
			title: 'Open Pioneer Trails',
			logo: {
				src: './src/assets/OPT-Logo.png'
			},
			social: [{ icon: 'github', label: 'OPT on GitHub', href: 'https://github.com/open-pioneer' }],
			sidebar: [
				{
					label: 'Technical documentation (en)',
					items: [
						{label: 'Table of contents', link: '/trails-docs/'},
						{label: 'Introduction', link: '/trails-docs/Introduction'},
						{label: 'Getting started', link: '/trails-docs/GettingStarted'},
						{label: 'Repository guide', link: '/trails-docs/RepositoryGuide'},
						{label: 'Contribution guide', link: '/trails-docs/Contributing'},
						{
							label: 'Tutorials',
							collapsed: true,
							items:[{autogenerate: { directory: 'trails-docs/tutorials' }}],
						},
						{label: 'Best practices', link: '/trails-docs/BestPractices'},
						{label: 'Ways to patch a package', link: '/trails-docs/WaysToPatchAPackage'},
						{
							label: 'Reference',
							collapsed: true,
							items:[{autogenerate: { directory: 'trails-docs/reference' }}],
						},
						{
							label: 'Internal documentation',
							collapsed: true,
							items:[
								{autogenerate: { directory: 'trails-docs/internals' }},
								{autogenerate: { directory: 'trails-docs/research' }}],
						},
					],
				},

			],
		}),
	],
});
