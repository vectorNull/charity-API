const path = require('path');
const geocoder = require('../utils/geocoder');
const Nonprofit = require('../models/Nonprofit');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all nonprofits
// @route   GET /api/v1/nonprofits
// @access  Public
exports.getNonprofits = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
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

// @desc    Create a single nonprofit
// @route   POST /api/v1/nonprofits
// @access  Private
exports.createNonprofit = asyncHandler(async (req, res, next) => {
    // Add user to req.body
    req.body.user = req.user.id;
    // Check for published nonprofit
    const publishedNonprofit = await Nonprofit.findOne({ user: req.user.id });
    // if the user is not an admin, they can only add one nonprofit
    if (publishedNonprofit && req.user.role != 'admin') {
        return next(
            new ErrorResponse(
                `The user with id ${req.user.id} has already published a nonprofit`
            ),
            400
        );
    }
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
    // Find nonprofit
    let nonprofit = await Nonprofit.findById(req.params.id);

    // Check to see if nonprofit exists
    if (!nonprofit) {
        return next(
            new ErrorResponse(
                `Resource not found with id of ${req.params.id}`,
                400
            )
        );
    }

    // Make sure user is nonprofit owner
    if (
        nonprofit.user.toString() !== req.user.id &&
        req.user.role !== 'admin'
    ) {
        return next(
            new ErrorResponse(
                `User ${req.params.id} is not authorized to update this nonprofit`
            )
        );
    }

    // Update only after owner has been verified
    nonprofit = await Nonprofit.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        data: nonprofit,
    });
});

// @desc    Delete a nonprofit
// @route   DELETE /api/v1/nonprofits
// @access  Private
exports.deleteNonprofit = asyncHandler(async (req, res, next) => {
    const nonprofit = await Nonprofit.findById(req.params.id);
    if (!nonprofit) {
        return next(
            new ErrorResponse(
                `Resource not found with id of ${req.params.id}`,
                400
            )
        );
    }
    
    // Make sure user is nonprofit owner before deleting
    if (
        nonprofit.user.toString() !== req.user.id &&
        req.user.role !== 'admin'
    ) {
        return next(
            new ErrorResponse(
                `User ${req.params.id} is not authorized to delete this nonprofit`
            )
        );
    }
    nonprofit.remove();

    res.status(200).json({
        success: true,
        data: {},
    });
});

// @desc    Get nonprofits within a radius
// @route   GET /api/v1/nonprofits/radius/:zipcode/:distance
// @access  Private
exports.getNonprofitsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;

    // Get lat and long from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calc radius using radians
    // Divide distance by radius of earth
    // radius of earth: 3,963 mi / 6,378 km
    const radius = distance / 3963;
    const nonprofits = await Nonprofit.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    });
    res.status(200).json({
        success: true,
        count: nonprofits.length,
        data: nonprofits,
    });
});

// @desc    Upload photo for nonprofit
// @route   PUT /api/v1/nonprofits/:id/photo
// @access  Private
exports.nonprofitPhotoUpload = asyncHandler(async (req, res, next) => {
    const nonprofit = await Nonprofit.findById(req.params.id);
    if (!nonprofit) {
        return next(
            new ErrorResponse(
                `Resource not found with id of ${req.params.id}`,
                400
            )
        );
    }

     // Make sure user is nonprofit owner before deleting
     if (
        nonprofit.user.toString() !== req.user.id &&
        req.user.role !== 'admin'
    ) {
        return next(
            new ErrorResponse(
                `User ${req.params.id} is not authorized to update this nonprofit`
            )
        );
    }

    if (!req.files) {
        return next(new ErrorResponse(`Please upload a file`, 400));
    }

    const file = req.files.file;

    // Validation to make sure file is photo
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload an image file`, 400));
    }

    // check file size
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(
            new ErrorResponse(
                `Please upload an image file less than ${process.env.MAX_FILE_UPLOAD}`,
                400
            )
        );
    }

    // Create custom file name to prevent overwrite
    file.name = `photo_${nonprofit._id}${path.parse(file.name).ext}`;
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
        if (err) {
            console.error(err);
            return next(new ErrorResponse(`Problem with file upload`, 500));
        }
        await Nonprofit.findByIdAndUpdate(req.params.id, { photo: file.name });
        res.status(200).json({
            success: true,
            data: file.name,
        });
    });
});
