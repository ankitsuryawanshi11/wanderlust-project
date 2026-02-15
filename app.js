if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT || 8080;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingsRouter = require("./router/listing.js");
const reviewsRouter = require("./router/review.js");
const userRouter = require("./router/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo').default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy  = require("passport-local");
const User = require("./models/user.js");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "public")));

let dbUrl = process.env.ATLUS_URL;

async function main(){
    try{
        await mongoose.connect(dbUrl);
    }catch(err){
        console.log(err);
    }
}

main();

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600
});

store.on("error", (err) => {
    console.log("ERROR in MOONGO server", err)
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1 * 24 * 60 * 60 * 1000,
        maxAge:  1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/review", reviewsRouter); 
app.use("/", userRouter)

app.use((req,res,next) => {
    console.log(req.method, req.url);
    next(new ExpressError(404, "Page not found"))
});

app.use((err,req,res,next) => {
    let {statusCode=500, message="something wents Wrong"} = err;
    console.log(err)
    console.log(message);
    res.status(statusCode).render("error.ejs", {message});
})

app.listen(port, () => {
    console.log("server is listening port", 8080);
});