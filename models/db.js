const mongoose = require('mongoose');
// Enter here your connection string
mongoose.connect('mongodb+srv://dbuser:dbuser@cluster0.fzasn.mongodb.net/?retryWrites=true&w=majority');

mongoose.connection.on("connected", function(){
    console.log("Application is connected to Database");
});
mongoose.connection.on("error", function(){
    console.log("Database Connection error");
});
