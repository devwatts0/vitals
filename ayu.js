const express = require('express')
const app = express()
const port = 3001;
const  io = require("socket.io-client");
const ws = require('ws');
const axios = require('axios').default;
var AyuSocket = io("http://localhost:8000");

//  var HealthSocket = new ws('ws://localhost:3000');
var HealthSocket = new ws('wss://health.cdot.in/wssdata/');

HealthSocket.on('open', () => {
  console.log("Health Server Connected")
 // HealthSocket.send([{"message":"connected to the websocket"}]);
});
    AyuSocket.on("connect",()=>{
        console.log("Connected to server")
    })


    AyuSocket.on("livedata-start",(data)=>{
      console.log(data)
    })
    AyuSocket.on("data",(data)=>{

      var Json = {
          "Timestamp":new Date().getTime(),
          "Cardiac":{
              "StethoscopePlot":data.data
          }
      }
      console.log(JSON.stringify(Json));
      HealthSocket.send(JSON.stringify(Json))
    });
    AyuSocket.on("livedata-stop",(data)=>{
      console.log(data);
    })



app.get('/startStethoscope', (req, res) => {
    axios.post('http://localhost:8000/record_playback',{ 
    "name": "my_heart.wav", // name of the file (filename must have extension .wav). If not provided random name with unix timestamp is created provided record param is true
    "duration": "10", // duration for recording in seconds
    "record": "true", // can be true or false
    "amplification": "8", // amplification factor between 2-25 (int)
    "filter": "heart", // can be heart, lung or nofilter
})
      .then(function (response) {
        //console.log(response);
      })
      .catch(function (error) {
        //console.log(error);
      })
      .then(function () {
        // always executed
      }); 
    res.send('Starting Steth test')
  })
  


app.get('/', (req, res) => {
  res.send('App Now Working!')
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})