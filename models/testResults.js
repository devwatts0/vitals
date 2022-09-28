const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VitalSchema = new Schema({
    Name:String,
    myData:Object
},{ collection: 'myanalysiscollection' });

module.exports = mongoose.model("myanalysiscollection", VitalSchema);
