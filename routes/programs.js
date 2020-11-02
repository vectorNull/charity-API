const express = require("express");

// Deconstruct controllers
const {
    getPrograms,
    getProgram,
    addProgram,
    updateProgram,
} = require("../controllers/programs");

const router = express.Router({ mergeParams: true });

router.route("/").get(getPrograms).post(addProgram);
router.route("/:id").get(getProgram).put(updateProgram);

module.exports = router;
