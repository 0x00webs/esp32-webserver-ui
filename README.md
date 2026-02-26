# Sensors Webserver Pages

This repository contains static HTML/CSS/JS pages served by an ESP32 webserver. Source files now live under `src/` (HTML, CSS, JS, images). The device has limited flash/heap, so it's important to ship the smallest possible assets.

## Development environment

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version) installed on your development machine. `npm` comes bundled and will be used to manage dependencies and run scripts.

(Previous versions used bun; if you still have bun installed the scripts will continue to work, but the examples below assume standard Node/npm.)

### Setup

Run the following once after cloning:

```bash
cd /home/nodewave/devhome/codeforafrica/sensors-webserver-pages
npm install    # install build tools into package.json
```

This installs build tools used to purge unused CSS, minify stylesheets and HTML, and optionally watch for changes.

> **Note:** A `bun.lock` file may remain from earlier setups; you can safely remove it if you only use npm.

### Building production files

```bash
npm run build   # use Node's npm to invoke the build script
```

For development with HTTPS and live reload run:

```bash
npm run gen-cert  # generate a self-signed cert/key (local.crt, local.key)
npm run serve      # serves `src/` over HTTPS using the cert, watches for changes
```

After building, you can preview the generated output using the same secure server:

```bash
npm run preview     # serves `output/` over HTTPS with the same cert
```

BrowserSync will start a long‑running process and log the local HTTPS URL (e.g. `https://localhost:3001`). Press Ctrl‑C to stop the server. If you see no immediate output the process may already be running in the background; open your browser at the URL shown earlier or `https://localhost:3001` by default.

That command will:

1. Read `src/style.css`, `src/scripts.js` (if present) and all `src/*.html` files.
2. Remove unused selectors from the stylesheet using [PurgeCSS](https://purgecss.com/).
3. Minify the resulting CSS with [CSSO](https://css.github.io/csso/).
4. Minify `scripts.js` using [terser](https://terser.org/) and optionally write `output/scripts.min.js`.
5. Inline the minified CSS and JavaScript into each HTML file (you can tweak `build.js` to link to `build/style.min.css`/`scripts.min.js` instead).
6. Minify the HTML using [html-minifier-terser](https://www.npmjs.com/package/html-minifier-terser).
7. Write the outputs to the `output/` directory.

8. Scan `src/assets/` subfolders, optimize any PNG/JPEG/SVG assets, and copy them into `output/` preserving their relative paths.
    - If a particular compressor (e.g. `pngquant`) fails, the original file is copied unchanged and a warning is logged, so the build never aborts.
        > **Modular architecture**: the build process is split into helper modules under `build/`.
        >
        > - `build/css.js` – handles purging & minifying styles.
        > - `build/js.js` – bundles/minifies shared scripts.
        > - `build/html.js` – inlines assets and minifies pages.
        > - `build/assets.js` – optimises images/SVGs.
        >   Feel free to add new modules (e.g. `build/manifest.js`, `build/icons.js`) and adjust `build.js` accordingly; the core orchestration simply calls exported functions.

### Extending the workflow

If you need another step – generating a cache manifest, hashing filenames, or compiling a template – drop a file under `build/` that exports a function, import it in `build.js`, and call it in sequence. Because each helper returns a promise, the main script remains a thin, readable orchestrator.### Output files

- `output/style.min.css` – the purified, minified stylesheet.
- `output/scripts.min.js` – optional minified copy of your shared script.
- `output/*.html` – each page with CSS/JS inlined and extra whitespace/JS stripped.

* any pictures/svgs from `src/assets/` also land under `output/` and are losslessly/compressively optimized.

The final files are typically only a few kilobytes and can be uploaded to the ESP32 filesystem.

### Watching during development

```bash
npm run watch   # watcher rebuilds automatically
```

A watcher will rebuild automatically whenever any HTML under `src/` or the stylesheet changes. (The watch script already monitors the `src/` directory.)

Alternatively, `npm run serve` will start an HTTPS server with HMR/auto‑reload powered by BrowserSync; it watches `src/**/*`.

### Cleaning

```bash
npm run clean   # remove output directory
```

Removes the `output/` directory.

## Notes & Tips

- For maximum savings you can further inline small scripts, shorten IDs/classes, or even convert to a single HTML page with conditional sections.
- Compression on the ESP32 (`gzip` or `deflate`) often helps but check available RAM.
- If you need to inspect which selectors are being removed, log or dump `purged` CSS in `build.js`.

---

Feel free to extend `build.js` with additional steps (e.g. image optimisation, content hashing) as your project grows.
