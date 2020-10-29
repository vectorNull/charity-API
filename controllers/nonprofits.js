const Nonprofit = require('../models/Nonprofit');

// @desc    Get all nonprofits
// @route   GET /api/v1/nonprofits
// @access  Public
exports.getNonprofits = (req, res, next) => {
	res.status(200).json({
		success: true,
		data: `Get all non-profits`,
	});
};

// @desc    Get a single nonprofit
// @route   GET /api/v1/nonprofits/:id
// @access  Private
exports.getNonprofit = (req, res, next) => {
	res.status(200).json({
		success: true,
		data: `Get a single non-profit. Id: ${req.params.id}`,
	});
};

// @desc    create a single nonprofits
// @route   POST /api/v1/nonprofits
// @access  Private
exports.createNonprofit = async (req, res, next) => {
	console.log(req.body);
	try {
		const nonprofit = await Nonprofit.create(req.body);
		res.status(201).json({
			success: true,
			data: nonprofit,
		});
	} catch (err) {
		res.status(400).json({ success: false });
		console.log(err);
	}
};
// @desc    Update a nonprofit
// @route   PUT /api/v1/nonprofits
// @access  Private
exports.updateNonprofit = (req, res, next) => {
	res.status(200).json({
		success: true,
		data: `Udpate a non-profit. Id: ${req.params.id}`,
	});
};

// @desc    Delete a nonprofit
// @route   DELETE /api/v1/nonprofits
// @access  Private
exports.deleteNonprofit = (req, res, next) => {
	res.status(200).json({
		success: true,
		data: `Delete a non-profit. Id: ${req.params.id}`,
	});
};
