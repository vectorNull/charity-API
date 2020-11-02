const express = require("express");

// Deconstruct controllers
const {
    getPrograms,
    getProgram,
    addProgram,
    updateProgram,
    deleteProgram
} = require("../controllers/programs");

const router = express.Router({ mergeParams: true });

router.route("/").get(getPrograms).post(addProgram);
router.route("/:id").get(getProgram).put(updateProgram).delete(deleteProgram);

module.exports = router;
