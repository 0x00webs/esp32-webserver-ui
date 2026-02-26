const fs = require('fs');
const path = require('path');
const { PurgeCSS } = require('purgecss');
const csso = require('csso');

async function processCss(htmlFiles, outDir, srcDir = 'src') {
	const css = fs.readFileSync(path.join(srcDir, 'style.css'), 'utf8');
	const purgeResult = await new PurgeCSS().purge({
		content: htmlFiles,
		css: [{ raw: css }],
	});

	const purified = purgeResult[0].css;
	const minifiedCss = csso.minify(purified).css;

	if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
	fs.writeFileSync(path.join(outDir, 'style.min.css'), minifiedCss);

	// return minified CSS for inlining
	return minifiedCss;
}

module.exports = { processCss };
