const User = require("../models/user.js");

module.exports.renderSignupForm = (req,res) => {
    res.render("user/signup.ejs");
};

module.exports.signup = async(req,res) => {
    try{
        const {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to wenderlust!");
            res.redirect("/listings");
        });
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
        // console.log(e);
    }
};

module.exports.renderLoginForm = (req,res) => {
    res.render("user/login.ejs");
};

module.exports.login = async(req,res) => {
    req.flash("success", "wellcome back to wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res, next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
    });
    req.flash("success", "you logout!");
    res.redirect("/listings");
}