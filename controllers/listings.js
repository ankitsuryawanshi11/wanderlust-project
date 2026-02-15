const { models } = require("mongoose");
const Listing = require("../models/listings.js");
const forwardGeocode = require("../utils/geocode");

module.exports.index = async(req,res) => {
    let allListings = await Listing.find({});
    res.render("listings/index", {allListings});
};

module.exports.renderNewForm = (req,res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req,res) => {
    let {id} = req.params;
    let listing  = await Listing.findById(id)
    .populate({path:"reviews" , populate:{path: "author"}})
    .populate("owner");
    if(!listing) {
        req.flash("error", "which listing you try to access does not exist");
        return res.redirect("/listings");
    }else{
        res.render("listings/show", {listing});
    }
    console.log(listing);
};

module.exports.createListing = async(req,res) => {
    if (!req.file) {
        req.flash("error", "Image is required!");
        return res.redirect("/listings/new");
    }
    const geoData = await forwardGeocode(req.body.listing.location);

    const url = req.file.path;
    const filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename}
    newListing.geometry = {
      type: "Point",
      coordinates: [geoData.lon, geoData.lat]
    };

    await newListing.save();
    req.flash("success", 'new listing is added, successfully!');
    res.redirect("/listings");
};

module.exports.renderEditForm = async(req,res) => {
    let {id} = req.params;
    let listing  = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "which listing you try to access does not exist");
        res.redirect("/listings");
    }else{
        let originalImageUrl = listing.image.url;
        originalImageUrl.replace("/upload", "/upload/h_300,w_30");
        res.render("listings/edit.ejs", {listing, originalImageUrl});
    }
};


module.exports.updateListing = async(req,res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url,filename };
        await listing.save();
    }
    req.flash("success", ' listing is edited, successfully!');
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async(req,res) => {
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", ' listing is Deleted, successfully!');
    res.redirect("/listings");
};