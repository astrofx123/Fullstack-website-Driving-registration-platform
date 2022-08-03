const user = require('../models/user')
module.exports = (request, response, next) => {
    user.findById(request.session.userId, (error, userData ) =>{
        console.log("Authentication middleware for Appointment called")
        if(error || !userData || userData.userType!="Admin" )
            return response.redirect('/');
        next();
    })
}