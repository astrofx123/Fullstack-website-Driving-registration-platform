const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require("express-fileupload");
const expressSession = require('express-session');
const flash = require('connect-flash');

require("dotenv").config();

// Controller 
const appCntl = require("./controllers/appCntl");
const userCntl = require("./controllers/userCntl");
const authMiddleware = require('./middleware/authenitcation');
const authMiddlewareAppointment = require('./middleware/authenticationAppointment');
const authMiddlewareExaminer = require('./middleware/authenticationExaminer');
const doNotReAuthMiddleware = require('./middleware/doNotReAuthenticate');
global.checkUserID = null;
global.checkUserType = null;

//DB Connection
require('./models/db')

const app = new express();
app.use(expressSession({
    secret: 'helloworld',
    resave: true,
    saveUninitialized: true
}))

app.use(express.static('public')); // To use our static files like css,javascript etc ..
app.use(fileUpload());
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.set('view engine', 'ejs');
const port = 3000;
app.listen(process.env.PORT || 3000, () => {
    console.log(`The server is listening on port no: ${port}`);
});

app.use('*', (request, response, next) => {
    checkUserID = request.session.userId;
    checkUserType = request.session.userType;
    next();
})

// HTTP (GET) request handlers (Page Routers)

app.get('/', appCntl.index);
app.get('/G2',authMiddleware,appCntl.g2);
app.get('/G',authMiddleware,userCntl.fetchUserDetails);
app.get('/login',doNotReAuthMiddleware,userCntl.login);
app.get('/examiner',authMiddlewareExaminer,appCntl.examiner);
app.get('/displayTestTaker/:id',authMiddlewareExaminer,appCntl.displayTestTaker);
app.get('/appointment',authMiddlewareAppointment,appCntl.appointmentPage);
app.get('/getTimeSlots/:id',authMiddleware,appCntl.getTimeSlots);
app.get('/getTimeSlotsGPage/:id',authMiddleware,appCntl.getTimeSlotsGPage);
app.get('/logout',userCntl.logout);

// HTTP (POST) request handlers (Page Routers) 

// DriverResult Post Request
app.post('/driverResult/:id',authMiddlewareExaminer,appCntl.DisplayResult);
app.post('/users/login',userCntl.proessLogin)
// For Post Request From G2 Page
app.post('/store',appCntl.storeData);
// For Post Request From G Page
app.post('/update', appCntl.updateUserData);
// For Post Request From Appointment Page
app.post('/timeSlots',appCntl.storeAppointment);
// For Post Request From SignUp Page
app.route('/signUp').get(doNotReAuthMiddleware,userCntl.registerUser).post(doNotReAuthMiddleware,userCntl.createUser);
// For Post Request From Examiner
app.post('/examiner',appCntl.storeData);

