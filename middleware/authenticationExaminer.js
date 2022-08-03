const user = require('../models/user')
module.exports = (request, response, next) => {
    user.findById(request.session.userId, (error, userData ) =>{
        console.log("Authentication middleware for Examnier called")
        if(error || !userData || userData.userType!="Examiner")
            return response.redirect('/');
        next();
    })
}