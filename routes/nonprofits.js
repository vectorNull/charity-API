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
} = require("../controllers/nonprofits");

// Geo route
router.route("/radius/:zipcode/:distance").get(getNonprofitsInRadius);

// Root routes
router.route("/").get(getNonprofits).post(createNonprofit);

// Routes requiring id
router
    .route("/:id")
    .get(getNonprofit)
    .put(updateNonprofit)
    .delete(deleteNonprofit);

module.exports = router;
