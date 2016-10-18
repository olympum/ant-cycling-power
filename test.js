var power_meter = require('./power-meter');
var pm = new power_meter.PowerMeter();

function a() {
  var power_instant = Math.round(Math.random() * 40 + 300);
  var cadence = Math.round(Math.random() * 10 + 80);
  pm.broadcast(power_instant, cadence);
  setTimeout(a, 500);
}

a();
