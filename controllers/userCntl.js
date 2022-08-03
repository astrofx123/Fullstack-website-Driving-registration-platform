const user = require("../models/user")
const bcrypt = require("bcrypt")

const login = (request, response) => {
    response.render('login',{error:null})
}
const logout = (request,response)=>{
    request.session.destroy(() =>{
        response.redirect('/')
    })
};
const registerUser = (request, response) => {
    const data_username = request.flash('data-uname')[0];
    const data_password = request.flash('data-password')[0];
    console.log("Flash username: ",data_username);
    console.log("Flash passsword: ",data_password);
    var username = '';
    var password = '';

    if(data_username != undefined || data_password != undefined) {
        username = data_username
        password = data_password
    }

    response.render('signUp', {errors: request.flash('validationErrors'), 
    username: username, 
    password: password
    });
}

// Get request G page
const fetchUserDetails = async (request, response) => {
    let userId = request.session.userId;
    if (userId != undefined) {
        const userData = await user.findOne({_id: userId});
        
        // IF user did not entered licence no. in g2 page
        if(userData.LicenceNumber === 'xyz'){
            return response.redirect('/g2');
        }
        else{
            response.render('g',{timeSlotsG:request.session.timeSlotsG,noTimeSlotsG:request.session.noTimeSlotsG,userSelectedDateGPage:request.session.userSelectedDateGPage,getUserG:userData});
        }
    }
    else {
        response.render('G', { getUser: undefined });
    }
}

const proessLogin = (request, response) => {
    const username = request.body.uname;
    const password = request.body.password;

    user.findOne({ userName: username }, function (error, userData) {
        if (userData) {
            bcrypt.compare(password, userData.password, (error, same) => {
                if (same) {
                    // Storing User's ID & Type In Browser Session
                    request.session.userId = userData._id;
                    request.session.userType = userData.userType;
                    response.redirect('/')
                } else {
                    console.log('Password does not match ..');
                    response.render('login',{error:'wrong password'})
                }
            })
        } else {
            console.log('Do SignUp First!');
            response.render('login',{error:'do_signup'})
        }
    });
}

const createUser = (request, response) => {

    // Create new user.
    let newUser = {
        userName: request.body.uname,
        password: request.body.password,
        userType: request.body.user_type,
    };
    user.create(newUser,(error, user) => {
        if (error) {
            const validationErrors = Object.keys(error.errors).map(key => error.errors[key].message);
            request.flash('validationErrors', validationErrors);
            request.flash('data-uname',request.body.uname);
            request.flash('data-password',request.body.password);
            return response.redirect("/signUp");
        }
        response.redirect('login')
    })
}

module.exports = {
    fetchUserDetails, login, proessLogin, registerUser, createUser, logout
}