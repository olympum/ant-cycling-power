var Ant = require('ant-plus');

var PowerMeter = function() {
  var stick = new Ant.GarminStick3;
  var channel = 1;
  if (!stick.is_present()) {
    stick = new Ant.GarminStick2;
  }

  stick.on('startup', function () {
    console.log('startup');
    console.log('Max channels:', stick.maxChannels);
    var deviceId = 0xBEEF;
    stick.write(Ant.Messages.assignChannel(channel, 'transmit'));
    stick.write(Ant.Messages.setDevice(channel, deviceId, 11, 1));
    stick.write(Ant.Messages.setFrequency(channel, 57));
    stick.write(Ant.Messages.setPeriod(channel, 8182));
    stick.write(Ant.Messages.openChannel(channel));
    console.log('cycling power meter initialized');
  });

  stick.on('shutdown', function () { console.log('shutdown'); });

  if (!stick.open()) {
  	console.log('ANT+ USB stick not found!');
  }

  this.stick = stick;
  this.channel = channel;
  this.power_event_count = 0;
  this.power_accumulated = 0;
};

PowerMeter.prototype.broadcast = function(power, cadence) {
  var data = [];
  data.push(this.channel);
  data.push(0x10); // power only
  this.power_event_count++;
  this.power_event_count = this.power_event_count % 255; // rollover 255
  data.push(this.power_event_count);
  data.push(0xFF); // pedal power not-used
  data.push(cadence); // cadence
  this.power_accumulated += power;
  this.power_accumulated = this.power_accumulated % 65536;
  console.log("Event: %s \t Power: %sw \t Cadence: %srpm", this.power_event_count, power, cadence);

  data = data.concat(Ant.Messages.intToLEHexArray(this.power_accumulated, 2));
  data = data.concat(Ant.Messages.intToLEHexArray(this.power, 2));
  this.stick.write(Ant.Messages.buildMessage(data, 0x4E)); //ANT_BROADCAST_DATA
};

module.exports.PowerMeter = PowerMeter;
