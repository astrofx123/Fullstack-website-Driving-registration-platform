const user = require('../models/user')
module.exports = (request, response, next) => {
    user.findById(request.session.userId, (error, userData ) =>{
        console.log("Authentication middleware called")
        if(error || !userData || userData.userType!="Driver")
            return response.redirect('/');
        next();
    })
}