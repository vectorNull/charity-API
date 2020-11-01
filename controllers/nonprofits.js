const geocoder = require("../utils/geocoder");
const Nonprofit = require("../models/Nonprofit");
const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/async");

// @desc    Get all nonprofits
// @route   GET /api/v1/nonprofits
// @access  Public
exports.getNonprofits = asyncHandler(async (req, res, next) => {
    let query;
    // copy req.query
    const reqQuery = { ...req.query };
    // Fields to exclude
    const removeFields = ["select", "sort", "page", "limit"];
    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    // Create operators
    queryStr = queryStr.replace(
        /\b(gt|gte|lt|lte|in)\b/g,
        (match) => `$${match}`
    );
    // Finding resource
    query = Nonprofit.find(JSON.parse(queryStr));
    // Select Fields
    if (req.query.select) {
        const fields = req.query.select.split(",").join(" ");
        query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        query = query.sort(sortBy);
    } else {
        query = query.sort("-createdAt");
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Nonprofit.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const nonprofits = await query;

    // Pagination result
    const pagination = {};
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit,
        };
    }

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit,
        };
    }

    res.status(200).json({
        success: true,
        count: nonprofits.length,
        pagination,
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
