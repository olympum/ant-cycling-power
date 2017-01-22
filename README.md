# ANT+ Bicycle Power Profile

This is a simple implementation of an ANT+ profile for a virtual power meter.
It only broadcasts instant power and cadence, with no torque or pedal
measurements.

## Install

You will need libudev installed. In Debian:

```bash
$ sudo apt install libudev-dev
```

You'll need to have `typings` and `tsc` installed:

```
$ npm install -g typings
$ npm install -g typescript
$ cd ant-cycling-power
$ typings install
$ npm install
```
When you plug in a USB-m ANT+ stick, the default permissions are for
only root to get access to it:

```bash
$ node test.js
/home/pi/ant-plus/node_modules/usb/usb.js:33
	this.__open()
	     ^

Error: LIBUSB_ERROR_ACCESS
    at Error (native)
    at Device.usb.Device.open (/home/pi/ant-plus/node_modules/usb/usb.js:33:7)
```

We can fix this by changing udev settings, for Garmin v1 and v2 sticks:

```bash
$ cat /etc/udev/rules.d/51-garmin-usb.rules
SUBSYSTEM=="usb", ATTRS{idVendor}=="0fcf", ATTRS{idProduct}=="1009", MODE="0666", ENV{ID_MM_DEVICE_IGNORE}="1"
SUBSYSTEM=="usb", ATTRS{idVendor}=="0fcf", ATTRS{idProduct}=="1008", MODE="0666", ENV{ID_MM_DEVICE_IGNORE}="1"
```

And reload udev rules:

```bash
$ sudo udevadm control --reload-rules
```

## Usage

```javascript
var power_meter = require('./power-meter');
var pm = new power_meter.PowerMeter();
pm.broadcast(320, 95); // 320 watts and 95 rpm
```
