const Program = require('../models/Program');
const Nonprofit = require('../models/Nonprofit');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/async');
const advancedResults = require('../middleware/advancedResults');

// @desc    Get programs
// @route   GET /api/v1/programs
// @route   GET /api/v1/nonprofit/:nonprofitId/programs
// @access  Public
exports.getPrograms = asyncHandler(async (req, res, next) => {
    if (req.params.nonprofitId) {
        const programs = await Program.find({
            nonprofitId: req.params.nonprofitId,
        });
        return res.status(200).json({
            success: true,
            count: programs.length,
            data: programs,
        });
    } else {
        res.status(200).json(res.advancedResults);
    }
});

// @desc    Get a single program
// @route   GET /api/v1/courses/:id
// @access  Public
exports.getProgram = asyncHandler(async (req, res, next) => {
    const program = await Program.findById(req.params.id).populate({
        path: 'nonprofitId',
        select: 'name description',
    });

    if (!program) {
        return next(
            new ErrorResponse(`No program with the id of ${req.params.id}`),
            404
        );
    }

    res.status(200).json({
        success: true,
        data: program,
    });
});

// @desc    Add a single program
// @route   POST /api/v1/nonprofits/:nonprofitId/courses
// @access  Private
exports.addProgram = asyncHandler(async (req, res, next) => {
    req.body.nonprofitId = req.params.nonprofitId;
    req.body.user = req.user.id;

    const nonprofit = await Nonprofit.findById(req.params.nonprofitId);
    console.log(nonprofit);
    if (!nonprofit) {
        return next(
            new ErrorResponse(
                `No nonprofit with the id of ${req.params.nonprofitId}`
            ),
            404
        );
    }

    // Make sure user is program owner
    if (program.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to add a program to ${nonprofit._id}`
            )
        );
    }

    const program = await Program.create(req.body);
    //console.log(program)
    res.status(200).json({
        success: true,
        data: program,
    });
});

// @desc    Update a single program
// @route   PUT /api/v1/programs/:id
// @access  Private
exports.updateProgram = asyncHandler(async (req, res, next) => {
    let program = await Program.findById(req.params.id);
    console.log(program);
    if (!program) {
        return next(
            new ErrorResponse(`No program with the id of ${req.params.id}`),
            404
        );
    }

    // Make sure user is program owner
    if (program.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to add a program to ${program._id}`
            )
        );
    }
    program = await Program.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    //console.log(program)
    res.status(200).json({
        success: true,
        data: program,
    });
});

// @desc    Delete a single program
// @route   DELETE /api/v1/programs/:id
// @access  Private
exports.deleteProgram = asyncHandler(async (req, res, next) => {
    const program = await Program.findById(req.params.id);
    console.log(program);
    if (!program) {
        return next(
            new ErrorResponse(`No program with the id of ${req.params.id}`),
            404
        );
    }

    // Make sure user is program owner
    if (program.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to add a program to ${program._id}`
            )
        );
    }
    await program.remove();

    //console.log(program)
    res.status(200).json({
        success: true,
        data: {},
    });
});
