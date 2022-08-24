const mongoose = require('mongoose');
// Enter here your connection string
mongoose.connect(process.env.DATABASE || 'mongodb+srv://admin:V2hPpaIL13hCsNa2@cluster0.tzrwn4j.mongodb.net/?retryWrites=true&w=majorit');

mongoose.connection.on("connected", function(){
    console.log("Application is connected to Database");
});
mongoose.connection.on("error", function(){
    console.log("Database Connection error");
});
