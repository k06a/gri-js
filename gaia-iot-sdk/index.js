//starts the IoT SDK 
const rpiDhtSensor = require('rpi-dht-sensor');
const dht = new rpiDhtSensor.DHT22(2);

function read () {
    var readout = dht.read();
   
      console.log('Temperature: ' + readout.temperature.toFixed(2) + 'C, ' +
          'humidity: ' + readout.humidity.toFixed(2) + '%');
      setTimeout(read, 5000);
  }
read();