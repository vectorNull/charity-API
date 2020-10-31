const Nonprofit = require("../models/Nonprofit");
const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/async");

// @desc    Get all nonprofits
// @route   GET /api/v1/nonprofits
// @access  Public
exports.getNonprofits = asyncHandler(async (req, res, next) => {
    const nonprofits = await Nonprofit.find();
    res.status(200).json({
        success: true,
        count: nonprofits.length,
        data: nonprofits,
    });
});

// @desc    Get a single nonprofit
// @route   GET /api/v1/nonprofits/:id
// @access  Private
exports.getNonprofit = asyncHandler(async (req, res, next) => {
    const nonprofit = await Nonprofit.findById(req.params.id);
    res.status(200).json({
        success: true,
        data: nonprofit,
    });
    if (!nonprofit) {
        // checks for null and by extension checks for properly formatted id
        return next(
            new ErrorResponse(
                `Resource not found with id of ${req.params.id}`,
                400
            )
        );
    }
});

// @desc    create a single nonprofit
// @route   POST /api/v1/nonprofits
// @access  Private
exports.createNonprofit = asyncHandler(async (req, res, next) => {
    const nonprofit = await Nonprofit.create(req.body);
    res.status(201).json({
        success: true,
        data: nonprofit,
    });
});

// @desc    Update a nonprofit
// @route   PUT /api/v1/nonprofits
// @access  Private
exports.updateNonprofit = asyncHandler(async (req, res, next) => {
    const nonprofit = await Nonprofit.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );
    if (!nonprofit) {
        return next(
            new ErrorResponse(
                `Resource not found with id of ${req.params.id}`,
                400
            )
        );
    }
    res.status(200).json({
        success: true,
        data: nonprofit,
    });
});

// @desc    Delete a nonprofit
// @route   DELETE /api/v1/nonprofits
// @access  Private
exports.deleteNonprofit = asyncHandler(async (req, res, next) => {
        const nonprofit = await Nonprofit.findByIdAndDelete(req.params.id);
        if (!nonprofit) {
            return next(
                new ErrorResponse(
                    `Resource not found with id of ${req.params.id}`,
                    400
                )
            );
        }
        res.status(200).json({
            success: true,
            data: {},
        });
   
});
