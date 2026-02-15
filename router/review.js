const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review.js");
const Listing = require("../models/listings.js");
const wrapAsyc = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn,isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");


//review
router.post("/",isLoggedIn, validateReview, wrapAsyc(reviewController.createReview));

//review DELETE
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, reviewController.destroyReview);

module.exports = router;