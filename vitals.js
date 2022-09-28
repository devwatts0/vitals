require("./config/db");
const VitalSchema = require("./models/testResults");
const ws = require("ws");
const HealthSocket = new ws("wss://health.cdot.in/wssdata/"); //ws://localhost:3000
HealthSocket.on("open", () => {
  console.log("Health Server Connected");
  //HealthSocket.send("Hello");
});
let timeStampLast = new Date().getTime();
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const simulateAsyncPause = () =>
  new Promise((resolve) => {
    setTimeout(() => resolve(), 1000);
  });
let changeStream;
async function run() {
  try {
    // open a Change Stream on the "haikus" collection
    changeStream = VitalSchema.watch();
    // set up a listener when change events are emitted
    changeStream.on("change", (next) => {
      // process any change event
      console.log("received a change to the collection: \t");
      var dataJSON = JSON.parse([next.fullDocument.mydata]);
      let Oxy = parseInt(dataJSON.SPO2) + getRandomInt(2);
      let timeStampCurrent = new Date().getTime();
      var Json = {
        General: {
          BPDiastolic: dataJSON.BP_Diastolic,
          BPSystolic: dataJSON.BP_Systolic,
          Temp: Number((dataJSON.Temperature1 * 1.8 + 32).toFixed(1)),
          OXY: Oxy <= 100 ? Oxy : parseInt(dataJSON.SPO2),
          Pulse: parseInt(dataJSON.Pulse_rate) + getRandomInt(2),
          Respiration_rate: dataJSON.Respiration_rate,
          BP_Mean: dataJSON.BP_Mean,
          Heart_rate: dataJSON.Heart_rate,
        },
        Timestamp: timeStampCurrent,
      };
      
     // if (timeStampCurrent - timeStampLast > 1000) {
        timeStampLast = timeStampCurrent;
        console.log(JSON.stringify(Json)); 
        console.log("Sending data to the Web Socket at: " + new Date(timeStampCurrent));

        HealthSocket.send(JSON.stringify(Json), function (err) {
         // console.log(err);
        });
        console.log("Data sent to the Web Socket");
    //  }
    });
    await simulateAsyncPause();
    //await changeStream.close();
  } finally {
  }
}
run().catch(console.dir);
