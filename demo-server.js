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
app.get('/device-id', (_req, res) => {
	res.type('text/plain').send('DEMO-DEVICE-1234');
});

app.get('/list-files', (_req, res) => {
	// Demo file system tree
	res.json({
		'logs': {
			'2026-02-27.txt': 'file',
			'2026-02-26.txt': 'file',
		},
		'config.json': 'file',
		'firmware': {
			'v1.0.0.bin': 'file',
		},
	});
});

app.get('/gsm_info', (_req, res) => {
	res.json({
		IMEI: '123456789012345',
		Signal: 'Strong',
		Carrier: 'DemoTel',
		Status: 'Connected',
	});
});

app.get('/wifi-info', (_req, res) => {
	res.json({
		SSID: 'DemoWiFi',
		IP: '192.168.1.100',
		Signal: 'Excellent',
		Status: 'Connected',
	});
});

app.get('/pm-data', (_req, res) => {
	res.json({
		'PM2.5': 12,
		'PM10': 25,
	});
});

app.get('/temperature', (_req, res) => {
	res.json({ value: 23.5, unit: '°C' });
});

app.get('/humidity', (_req, res) => {
	res.json({ value: 55, unit: '%' });
});

app.get('/sensor-data', (_req, res) => {
	res.json({
		PM: {
			'PM2.5': 12,
			'PM10': 25,
		},
		DHT: {
			temperature: 23.5,
			humidity: 55,
		},
	});
});

// OTA upload demo endpoint (does not actually store files)
app.post('/ota-upload', (_req, res) => {
	res.json({ status: 'success', message: 'Firmware uploaded (demo)' });
});

app.listen(PORT, () => {
	console.log(`Demo server running at http://localhost:${PORT}`);
});
