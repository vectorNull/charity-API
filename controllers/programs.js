const Program = require("../models/Program");
const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/async");

// @desc    Get programs
// @route   GET /api/v1/programs
// @route   GET /api/v1/nonprofit/:nonprofitId/programs
// @access  Public
exports.getPrograms = asyncHandler(async (req, res, next) => {
    let query;
    if(req.params) {
        query = Program.find({ nonprofitId: req.params.nonprofitId });
    } else {
        query = Program.find();
    }
    const programs = await query;
    res.status(200).json({
        success: true,
        count: programs.length,
        data: programs
    })
})

