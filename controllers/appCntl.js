const { response } = require('express');
const { request } = require('http');
const path = require('path');
const user = require("../models/user")
const appointment = require("../models/appointment");
const res = require('express/lib/response');

const index = (request, response) => {
    response.render('index');
}
// Appointment page GET request
const appointmentPage = async (request, response) => {
    response.render('appointment', { err: undefined, message: undefined });
}
// Examiner Page GET Request
const examiner = async(request, response) => {
     const result = await user.find({}).populate("appointmentId").then((data)=>{
         console.log('With Populate: ',data);
         response.render('examiner',{testTakers:data});
        });     
}
// DisplayResult Post Request
const DisplayResult = async(request,response) =>{
    const testTakerId = request.params.id;
    console.log(testTakerId);
    const currentTestTaker = await user.findOneAndUpdate({_id:testTakerId},{
        $set: {
            testResult: request.body.result,
            examinerComment: request.body.comment
        }
    });
    if(currentTestTaker){
        response.redirect('/');
    }
    else{
        response.render('displayTestTaker',{currentTestTaker:currentTestTaker});
    }
}
const displayTestTaker = async(request,response)=>{
    const currentTestTakerId = request.params.id;
    const currentTestTaker = await user.findById(currentTestTakerId);
    response.render('displayTestTaker',{currentTestTaker:currentTestTaker});
}
const g2 = async(request, response) => {
    let userIdG2 = request.session.userId;
    if (userIdG2 != undefined) {
         const userDataG2 = await user.findOne({_id: userIdG2});
         console.log('Users data G2:',userDataG2);
         response.render('g2',{timeSlots:request.session.timeSlots,noTimeSlots:request.session.noTimeSlots,userSelectedDate:request.session.userSelectedDate,getUserG2:userDataG2});
    }
    else{
        response.render('g2',{timeSlots:request.session.timeSlots,noTimeSlots:request.session.noTimeSlots,userSelectedDate:request.session.userSelectedDate,getUserG2:undefined});
    }
}
// Store data which is coming from g2 page
const storeData = async (request, response) => {
    let Image1 = request.files.Image1;
    let Image2 = request.files.Image2;
    let userDate = request.body.userSelectedDate;
    let userTime = request.body.userSelectedTime;
    console.log("Post request: ", userDate, userTime);

    // First get the reference of appointment based on user selected date & time.
    const result = await appointment.findOneAndUpdate({ $and: [{ date: userDate }, { time: userTime }] }, {
        $set: {
            isAvailable: false
        }
    });

    console.log("Found appointment is: ", result._id);
    request.session.appointmentId = result._id;

    await Image1.mv(path.resolve(__dirname, '../public/assets/img', Image1.name), async (error) => {
        try {
            await user.updateOne({
                _id: request.session.userId
            }, {
                $set: {
                    FirstName: request.body.fname,
                    LastName: request.body.lname,
                    DOB: request.body.dob,
                    HouseNumber: request.body.house_no,
                    StreetName: request.body.street_name,
                    City: request.body.city,
                    Province: request.body.province,
                    Postal: request.body.postal,
                    Brand: request.body.make,
                    Model: request.body.model,
                    Year: request.body.year,
                    PlateNumber: request.body.plate_num,
                    LicenceNumber: request.body.license_no,
                    Image1: '/assets/img/' + Image1.name,
                    Image2: '/assets/img/' + Image2.name,
                    appointmentId: request.session.appointmentId,
                    testType: "G2"
                }
            }, { upsert: true });
        }
        catch (error) {
            console.log(error);
        }
    });

    Image2.mv(path.resolve(__dirname, '../public/assets/img', Image2.name), async (error) => {
        console.log("Error: " + error);
    });
    response.redirect('/');
}

// Post Request From G Page
const updateUserData = async (request, response) => {
    let userDateGPage = request.body.userSelectedDateG;
    let userTimeGPage = request.body.userSelectedTimeG;
    console.log("Post request from g page: ", userDateGPage, userTimeGPage);

    // First get the reference of appointment based on user selected date & time.
    const result = await appointment.findOneAndUpdate({ $and: [{ date: userDateGPage }, { time: userTimeGPage }] }, {
        $set: {
            isAvailable: false
        }
    });
    request.session.appointmentIdGPage = result._id;

    await user.updateOne({
        _id: request.session.userId
    },
        {
            $set: {
                HouseNumber: request.body.house_no,
                StreetName: request.body.street_name,
                City: request.body.city,
                Province: request.body.province,
                Postal: request.body.postal,
                Brand: request.body.make,
                Model: request.body.model,
                Year: request.body.year,
                PlateNumber: request.body.plate_num,
                appointmentId: request.session.appointmentIdGPage,
                testType: "G",
                testResult: "",
                examinerComment: ""
            }
        }).then(res => console.log('multiple await:',res)).catch(err => console.log(err));
    response.redirect('/');
};

// Store created appointment data which are coming from appointment page
const storeAppointment = async (request, response) => {
    // Create new appointment.
    let newAppointment = {
        date: request.body.date,
        time: request.body.time,
        userId: request.session.userId
    };
    // If appointment is created 
    appointment.find({ userId: request.session.userId }, (err, data) => {
        if (err) {
            return response.render('appointment', { err: err, message: undefined });
        }
        // if appointment is present.
        else if (data.length == 0) {
            appointment.create(newAppointment).then((data) => {
                console.log("Appointment Successfully stored: ", data);
                return response.render('appointment', { err: undefined, message: `Time slot ${request.body.time} on ${request.body.date} has been created` });
            }).catch((error) => {
                console.log("Error while storing appointment: ", error);
                return response.render('appointment', { err: error, message: undefined });
            });
        }
        else if (data.length > 0) {
            let noDuplicateAppointment = true;
            // Checking for duplicate appointment ..
            for (let i = 0; i < data.length; i++) {
                console.log("Fetched Data is : ", data[i]);
                if (data[i].date == request.body.date && data[i].time == request.body.time) {
                    noDuplicateAppointment = false;
                    return response.render('appointment', { err: "Already created by you..", message: undefined });
                }
            }
            // IF no dulicate appointment is found ..
            if (noDuplicateAppointment) {
                appointment.create(newAppointment).then((data) => {
                    console.log("Appointment Successfully stored: ", data);
                    return response.render('appointment', { err: undefined, message: `Time slot ${request.body.time} on ${request.body.date} has been created` });
                }).catch((error) => {
                    console.log("Error while storing appointment: ", error);
                    return response.render('appointment', { err: error, message: undefined });
                });
            }
        }
    });
}

// GetAvailable time slots for G2 Page
const getTimeSlots = async (request, response) => {
    const userSelectedDate = request.params.id;
    const data = await appointment.find({ date: userSelectedDate });
    // if no appointments are created for selected data
    if (!isNaN(data)) {
        console.log('Data is not found');
        request.session.noTimeSlots = true;
        request.session.timeSlots = false;
        request.session.userSelectedDate = "";
        return response.redirect('/g2');
    }
    else {
        let timeSlots = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i].isAvailable) {
                timeSlots.push(data[i].time);
            }
        }
        request.session.noTimeSlots = false;
        request.session.timeSlots = timeSlots;
        request.session.userSelectedDate = userSelectedDate;
        return response.redirect('/g2');
    }
}
// GetAvailable time slots for G Page
const getTimeSlotsGPage = async (request, response) => {
    const userSelectedDateGPage = request.params.id;
    const data = await appointment.find({ date: userSelectedDateGPage });
    // if no appointments are created for selected data
    if (!isNaN(data)) {
        console.log('Data is not found');
        request.session.noTimeSlotsG = true;
        request.session.timeSlotsG = false;
        request.session.userSelectedDateGPage = "";
        return response.redirect('/g');
    }
    else {
        let timeSlotsG = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i].isAvailable) {
                timeSlotsG.push(data[i].time);
            }
        }
        request.session.noTimeSlotsG = false;
        request.session.timeSlotsG = timeSlotsG;
        request.session.userSelectedDateGPage = userSelectedDateGPage;
        return response.redirect('/g');
    }
}
module.exports = {
    index, g2, storeData, updateUserData, appointmentPage, storeAppointment, getTimeSlots, examiner, displayTestTaker,DisplayResult,getTimeSlotsGPage
};