const fs = require('fs');
const path = require('path');
const { minify } = require('html-minifier-terser');

// use an options object so callers can't accidentally swap arguments
async function processHtml({
	htmlFiles,
	minifiedCss,
	minifiedScript,
	outDir,
	srcDir = 'src',
}) {
	// make sure we weren't accidentally handed the script text as the
	// output directory. swapping the arg order (e.g. build.js) results in
	// `outDir` containing the minified JS which then shows up in the write
	// path (`<script code>/ota.html`) and triggers ENOENT. a runtime check
	// like this helps catch the mistake earlier.
	if (
		typeof outDir !== 'string' ||
		outDir.includes('function') ||
		outDir.includes('{')
	) {
		throw new Error(`processHtml called with bad outDir: ${outDir}`);
	}
	for (const file of htmlFiles) {
		// file may include src/ prefix already
		let html = fs.readFileSync(
			path.join(srcDir, path.basename(file)),
			'utf8',
		);

		// rewrite stylesheet reference if we produced a minified variant
		if (minifiedCss) {
			html = html.replace(
				/<link\s+rel="stylesheet"\s+href="style\.css"\s*\/?\s*>/, // allow trailing slash/spaces
				'<link rel="stylesheet" href="style.min.css">',
			);
		}
		// to inline instead, uncomment the block below:
		// html = html.replace(
		// 	/<link\s+rel="stylesheet"\s+href="style\.css"\s*\/?\s*>/,
		// 	`<style>${minifiedCss}</style>`,
		// );

		// replace script tag when a minified script is available
		// the original HTML references `scripts.js`, which isn't generated
		// by the build. update it to point at the minified bundle instead. we
		// could inline the code here (see commented alternative) but linking
		// keeps the html smaller and allows caching of scripts.min.js.
		if (minifiedScript) {
			html = html.replace(
				/<script\s+src="scripts\.js"(?:\s+defer)?><\/script>/,
				'<script src="scripts.min.js" defer></script>',
			);

			// if you ever want to inline the JS instead, use this pattern:
			// html = html.replace(
			//     /<script\s+src="scripts\.js"(?:\s+defer)?><\/script>/,
			//     `<script>${minifiedScript}</script>`
			// );
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
