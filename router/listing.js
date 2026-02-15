const express = require("express");
const router = express.Router();
const Listing = require("../models/listings.js");
const wrapAsyc = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
// const Review = require("../models/review.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const Review = require("../models/review.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage })


router.route("/")
    .get(wrapAsyc(listingController.index))
    .post(isLoggedIn,upload.single("listing[image]"),validateListing,
    wrapAsyc(listingController.createListing))



//NEW LISTING
router.get("/new",isLoggedIn, listingController.renderNewForm);

router.route("/:id")
    .get(wrapAsyc(listingController.showListing))
    .put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,
    wrapAsyc(listingController.updateListing))
    .delete(isLoggedIn,isOwner, wrapAsyc(listingController.destroyListing))

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsyc(listingController.renderEditForm));


module.exports = router;