/*
The MIT License (MIT)
=====================

Copyright © `2018` `Pong Cheecharern, Gain Kenchayuth`

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the “Software”), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

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
    console.log("data submitted to gaia chain")
    setTimeout(submitData, 3000);
}
submitData();