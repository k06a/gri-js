const rpiDhtSensor = require('rpi-dht-sensor');
const axios = require('axios') 
const dht = new rpiDhtSensor.DHT22(2);
const gaiaNode = "192.168.86.97" 
function submitData () {
  const readout = dht.read();
  let _data = {
      temperature: readout.temperature.toFixed(10)
  }
  let _meta = {
        coordinates: "kx-building",
        deviceType: "temperature_sensor",
        date: Date.now()
  }
  axios.post('http://192.168.86.97:3000/submitData', {
    data: _data,
    meta: _meta
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
    
    setTimeout(submitData, 3000);
}
submitData();