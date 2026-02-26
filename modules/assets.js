const fs = require('fs');
const path = require('path');
const glob = require('glob');
const imagemin = require('imagemin');

// helper to unwrap default if module is exported as { default: ... } (commonjs/ESM interop)
function pkg(plugin) {
	return plugin && plugin.default ? plugin.default : plugin;
}

// unwrap commonjs/esmodule differences for imagemin itself
const imageminFn = pkg(imagemin);
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminSvgo = require('imagemin-svgo');

async function optimizeAssets(patterns, destRoot, srcDir = 'src') {
	const files = glob.sync(
		patterns.map((p) => path.join(srcDir, p)),
		{ nodir: true },
	);
	const plugins = [
		pkg(imageminMozjpeg)({ quality: 75 }),
		pkg(imageminPngquant)({ quality: [0.6, 0.8] }),
		pkg(imageminSvgo)(),
	];
	for (const file of files) {
		const relative = path.relative(srcDir, file);
		const destPath = path.join(destRoot, relative);
		const destDir = path.dirname(destPath);
		if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
		try {
			await imageminFn([file], {
				destination: destDir,
				plugins,
			});
		} catch (err) {
			console.warn(
				'asset optimization failed for',
				file,
				'; copying original:',
				err.message,
			);
			fs.copyFileSync(file, destPath);
		}
	}
}

module.exports = { optimizeAssets };
