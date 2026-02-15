const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings.js");


async function main(){
    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
    }catch(err){
        console.log(err);
    }
}

main();

async function initDB(){
    await Listing.deleteMany({});
    initData.data =  initData.data.map((obj) => ({...obj, owner: '698b2744a13f145da32ef170'}))
    await Listing.insertMany(initData.data);
    console.log("data saved");
}

initDB();
