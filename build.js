const fs = require('fs');
const path = require('path');
const glob = require('glob');

// modular helpers
const { processCss } = require('./modules/css');
const { processJs } = require('./modules/js');
const { processHtml } = require('./modules/html');
const { optimizeAssets } = require('./modules/assets');

async function build() {
	const srcDir = 'src';
	const htmlFiles = glob.sync(path.join(srcDir, '*.html'));
	const outDir = 'output';

	if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

	const minifiedCss = await processCss(htmlFiles, outDir, srcDir);
	const minifiedScript = await processJs(outDir, srcDir);
	await optimizeAssets(
		['icons/**/*.{png,jpg,jpeg,svg}', '*.{png,jpg,jpeg,svg}'],
		outDir,
		srcDir,
	);
	// use named options to avoid argument-order bugs
	await processHtml({
		htmlFiles,
		minifiedCss,
		minifiedScript,
		outDir,
		srcDir,
	});

	console.log('build complete, output in:', outDir);
}

build().catch((err) => {
	console.error(err);
	process.exit(1);
});
