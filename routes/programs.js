const express = require("express");

// Deconstruct controllers
const {
    getPrograms
} = require("../controllers/programs");

const router = express.Router({ mergeParams: true });


router.route('/').get(getPrograms);

module.exports = router;