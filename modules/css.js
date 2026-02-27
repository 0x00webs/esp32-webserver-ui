const fs = require('fs');
const path = require('path');
const { PurgeCSS } = require('purgecss');
const csso = require('csso');

async function processCss(htmlFiles, outDir, srcDir = 'src') {
	const css = fs.readFileSync(path.join(srcDir, 'style.css'), 'utf8');
	// PurgeCSS removes any selectors that aren't found in the
	// provided HTML. Since we add `active`/`open` classes dynamically
	// in JavaScript, they need to be safelisted or the rules will be
	// dropped (which hides the mobile menu).
	const purgeResult = await new PurgeCSS().purge({
		content: htmlFiles,
		css: [{ raw: css }],
		// keep classes used only by script
		safelist: [
			/nav-list/, // pointers to menu
			/nav-toggle/, // hamburger button
			/active/, // toggled open state
			/open/, // toggled open state for button
		],
	});

	const purified = purgeResult[0].css;
	const minifiedCss = csso.minify(purified).css;

	if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
	fs.writeFileSync(path.join(outDir, 'style.min.css'), minifiedCss);

	// return minified CSS for inlining
	return minifiedCss;
}

module.exports = { processCss };
