const fs = require('fs');
const path = require('path');
const { minify: minifyJS } = require('terser');

async function processJs(outDir, srcDir = 'src') {
	let minifiedScript = '';
	const scriptPath = path.join(srcDir, 'scripts.js');
	if (fs.existsSync(scriptPath)) {
		const js = fs.readFileSync(scriptPath, 'utf8');
		const result = await minifyJS(js, {
			compress: true,
			mangle: true,
		});
		minifiedScript = result.code || '';

		if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
		fs.writeFileSync(path.join(outDir, 'scripts.min.js'), minifiedScript);
	}
	return minifiedScript;
}

module.exports = { processJs };
