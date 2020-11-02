const express = require("express");

// Deconstruct controllers
const {
    getPrograms,
    getProgram,
    addProgram,
    updateProgram,
    deleteProgram,
} = require("../controllers/programs");

const Program = require("../models/Program");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router({ mergeParams: true });

router
    .route("/")
    .get(
        advancedResults(Program, {
            path: "nonprofitId",
            select: "name description",
        }),
        getPrograms
    )
    .post(addProgram);
router.route("/:id").get(getProgram).put(updateProgram).delete(deleteProgram);

module.exports = router;
