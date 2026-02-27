`GET /device-id`

- Returns the device ID, which is a unique identifier for the device.

```plain
sensor‑ABC123
```

`GET /available-hotspots`

- Returns an object whose property names are Wi‑Fi SSIDs and whose values are objects containing rssi and encType.

```json
{
	"Home WiFi": {
		"rssi": -45,
		"encType": "WPA2"
	},
	"Coffee Shop": {
		"rssi": -70,
		"encType": "Open"
	}
}
```

`POST /sace-config`

- Accepts a JSON body and merges it into the saved configuration.
    - 400 Bad Request if the body is not valid JSON.

        ```json
        {
        	"error": "Invalid JSON"
        }
        ```

    - 200 OK if the configuration was successfully updated.

        ```json
        {
        	"status": "Config received"
        }
        ```

`GET /sensor-data`

- Returns the current readings held in current_sensor_data.
- The object may contain one or both of the following properties.

```json
{
	"DHT": {
		"temperature": 22.5,
		"humidity": 60
	},
	"PM": {
		"PM1": 10,
		"PM2.5": 20,
		"PM10": 30
	}
}
```

`GET /gsm_info`

- Returns the current GSM information

```json
{
	"Network Name": "TelcoX",
	"Signal Strength": -72,
	"SIM ICCID": "8914800000123456789",
	"Model ID": "Quectel‑EG91",
	"Firmware Version": "EG91R9M0A03",
	"IMEI": "356789012345678"
}
```

`GET /list-files`

- Returns an array of file names currently stored on the device.

```json
{
	"config.json": "file",
	"logs": {
		"2025-01-01.csv": "file",
		"archive": {
			"old.log": "file"
		}
	}
}
```

`POST /upload-firmware`

- This multipart handler responds at three stages:

1. initial request – immediately returns

```json
{
	"status": "Upload started"
}
```

2. during upload – the file is written to LittleFS
3. finalisation – once the file is closed:

```json
{
	"status": "Upload successful"
}
```

4. or, on error:

```json
{
	"error": "Failed to open file" // (or "File not open")
}
```

`GET /device-details`

- Returns an object containing all available device details, including GSM info, Wi‑Fi info, and any other relevant information.

```json
{
	"gsm": {
		"Network Name": "TelcoX",
		"Signal Strength": -72,
		"SIM ICCID": "8914800000123456789",
		"Model ID": "Quectel‑EG91",
		"Firmware Version": "EG91R9M0A03",
		"IMEI": "356789012345678"
	},
	"wifi": {
		"SSID": "Home WiFi",
		"Signal Strength": -45,
		"Encryption Type": "WPA2"
	}
}
```
