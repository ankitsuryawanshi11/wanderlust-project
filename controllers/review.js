const Review = require("../models/review.js");
const Listing = require("../models/listings.js");

module.exports.createReview = async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview._id);

    await newReview.save();
    await listing.save();
    req.flash("success", 'New review is added, successfully!'); 
    res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview = async(req,res) => {
    let{id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", 'Revew is deleted, successfully!');
    res.redirect(`/listings/${id}`);
};