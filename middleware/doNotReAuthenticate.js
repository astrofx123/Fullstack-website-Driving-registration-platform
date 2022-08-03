module.exports = (request, response, next) =>{
    if(request.session.userId){
        console.log("Do Not ReAuth Middleware called");
        return response.redirect('/');
    }
    next();
}