const express = require("express");
const router = express.Router();

// Deconstruct controllers
const {
    getNonprofits,
    getNonprofit,
    createNonprofit,
    updateNonprofit,
    deleteNonprofit,
    getNonprofitsInRadius,
    nonprofitPhotoUpload,
} = require("../controllers/nonprofits");

const Nonprofit = require("../models/Nonprofit");
const advancedResults = require("../middleware/advancedResults");

// Include other resource routers
const programRouter = require("./programs");

// re-route into other resource routers
router.use("/:nonprofitId/programs", programRouter);

// Geo route
router.route("/radius/:zipcode/:distance").get(getNonprofitsInRadius);

// Upload photo route
router.route("/:id/photo").put(nonprofitPhotoUpload);

// Root routes
router
    .route("/")
    .get(advancedResults(Nonprofit, "programs"), getNonprofits)
    .post(createNonprofit);

// Routes requiring id
router
    .route("/:id")
    .get(getNonprofit)
    .put(updateNonprofit)
    .delete(deleteNonprofit);

module.exports = router;
