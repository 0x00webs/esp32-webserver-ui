const fs = require('fs');
const path = require('path');
const { minify } = require('html-minifier-terser');

async function processHtml(
	htmlFiles,
	minifiedCss,
	minifiedScript,
	outDir,
	srcDir = 'src',
) {
	for (const file of htmlFiles) {
		// file may include src/ prefix already
		let html = fs.readFileSync(
			path.join(srcDir, path.basename(file)),
			'utf8',
		);

		// inline the minified css by default; comment out if you prefer linking
		// match `<link rel="stylesheet" href="style.css">`,
		// `<link rel="stylesheet" href="style.css" />`, or with extra spaces
		// use a regex with optional whitespace and slash before closing bracket
		html = html.replace(
			/<link\s+rel="stylesheet"\s+href="style\.css"\s*\/?>/, // allow trailing slash
			`<style>${minifiedCss}</style>`,
		);

		// replace script tag to either inline or point to minified file
		if (minifiedScript) {
			html = html.replace(
				/<script src="scripts\.js" defer><\/script>/,
				`<script>${minifiedScript}</script>`,
			);
		}

		const minifiedHtml = await minify(html, {
			collapseWhitespace: true,
			removeComments: true,
			minifyJS: true,
			minifyCSS: true,
		});

		fs.writeFileSync(path.join(outDir, path.basename(file)), minifiedHtml);
	}
}

module.exports = { processHtml };
