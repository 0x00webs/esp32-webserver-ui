// Demo server for sensors-webserver-pages
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
console.log('Starting demo server...');
console.log(`Serving static files from: ${path.join(__dirname, 'src')}`);

// Serve static files from src directory
app.use(express.static(path.join(__dirname, 'src')));

// Demo endpoints

// GET /device-id
app.get('/device-id', (_req, res) => {
	// Returns the device ID as plain text
	res.type('text/plain').send('sensor‑ABC123');
});

// GET /list-files
app.get('/list-files', (_req, res) => {
	res.json({
		'config.json': 'file',
		'logs': {
			'2025-01-01.csv': 'file',
			'archive': {
				'old.log': 'file',
			},
		},
	});
});

// GET /sensor-data
app.get('/sensor-data', (_req, res) => {
	res.json({
		DHT: {
			temperature: 22.5,
			humidity: 60,
		},
		PM: {
			'PM1': 10,
			'PM2.5': 20,
			'PM10': 30,
		},
	});
});

// OTA upload demo endpoints (does not actually store files)
app.post('/ota-upload', (_req, res) => {
	res.json({ status: 'success', message: 'Firmware uploaded (demo)' });
});

// Single endpoint for all device details
app.get('/device-details', (_req, res) => {
	res.json({
		gsm: {
			'Network Name': 'TelcoX',
			'Signal Strength': -72,
			'SIM ICCID': '8914800000123456789',
			'Model ID': 'Quectel‑EG91',
			'Firmware Version': 'EG91R9M0A03',
			'IMEI': '356789012345678',
		},
		wifi: {},
	});
});

app.listen(PORT, () => {
	console.log(`Demo server running at http://localhost:${PORT}`);
});
