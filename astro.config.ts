import { defineConfig, passthroughImageService } from 'astro/config';
import fs from 'fs';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import remarkUnwrapImages from 'remark-unwrap-images';
// @ts-ignore:next-line
import { remarkReadingTime } from './src/utils/remark-reading-time.mjs';

// https://astro.build/config
export default defineConfig({
	// ! Please remember to replace the following site property with your own domain
	site: 'https://ryangwn.vercel.app/',
	markdown: {
		remarkPlugins: [remarkUnwrapImages, remarkReadingTime],
		remarkRehype: { footnoteLabelProperties: { className: [''] } },
		shikiConfig: {
			theme: 'github-dark-dimmed',
			wrap: true,
		},
	},
	integrations: [
		mdx({}),
		tailwind({
			applyBaseStyles: false,
		}),
		sitemap(),
	],
	prefetch: true,
	vite: {
		plugins: [rawFonts(['.ttf'])],
		optimizeDeps: {
			exclude: ['@resvg/resvg-js'],
		},
	},
	image: {
		service: passthroughImageService(),
	},
});

function rawFonts(ext: Array<string>) {
	return {
		name: 'vite-plugin-raw-fonts',
		// @ts-ignore:next-line
		transform(_, id) {
			if (ext.some((e) => id.endsWith(e))) {
				const buffer = fs.readFileSync(id);
				return {
					code: `export default ${JSON.stringify(buffer)}`,
					map: null,
				};
			}
		},
	};
}
