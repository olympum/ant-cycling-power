# ANT+ Bicycle Power Profile

This is a simple implementation of an ANT+ profile for a virtual power meter.
It only broadcasts instant power and cadence, with no torque or pedal
measurements.

## Install

You'll need to have `typings` and `tsc` installed:

```
$ npm install -g typings
$ npm install -g typescript
$ cd ant-cycling-power
$ typings
$ npm install
```

## Usage

```javascript
var power_meter = require('./power-meter');
var pm = new power_meter.PowerMeter();
pm.broadcast(320, 95); // 320 watts and 95 rpm
```
