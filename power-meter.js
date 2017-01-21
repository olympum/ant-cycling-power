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
    // 0xCAFFEDOOD
    var deviceId = 0xBEEF;
    stick.write(Ant.Messages.assignChannel(channel, 'transmit'));
    // The device type shall be set to 11 (0x0B) when searching to pair to an ANT+ bike power sensor
    // The transmitting sensor contains a 16-bit number that uniquely identifies its
    // transmissions. Set the Device Number parameter to zero to allow wildcard
    // matching. Once the device number is learned, the receiving device should
    // remember the number for future searches.
    // Device number set to 1 here
    stick.write(Ant.Messages.setDevice(channel, deviceId, 11, 1));
    // RF Channel 57 (2457 MHz) is used for the ANT+ bike power sensor.
    stick.write(Ant.Messages.setFrequency(channel, 57));
    // Channel period Data is transmitted from most bike power sensors every 8182/32768 seconds
    // (approximately 4.00 Hz). This channel period shall be used by default.
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
  data = data.concat(Ant.Messages.intToLEHexArray(power, 2));
  this.stick.write(Ant.Messages.buildMessage(data, 0x4E)); //ANT_BROADCAST_DATA
};

module.exports.PowerMeter = PowerMeter;
