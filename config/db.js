const mongoose = require('mongoose');

module.exports.mongoConnection = mongoose.connect("mongodb+srv://admin2:test123@cluster0.xhxjl6m.mongodb.net/myanalysis?retryWrites=true&w=majority", {
    useNewUrlParser:true,
    useUnifiedTopology:true
} , err =>{
    if(!err){
        console.log('Database Connected Successfully');
    }else{
        console.log('Error in Connecting Mongodb' ,err);
    }
})