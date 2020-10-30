const Nonprofit = require("../models/Nonprofit");

// @desc    Get all nonprofits
// @route   GET /api/v1/nonprofits
// @access  Public
exports.getNonprofits = async (req, res, next) => {
	try {
		const nonprofits = await Nonprofit.find();
		res.status(200).json({
			success: true,
			count: nonprofits.length,
			data: nonprofits,
		});
	} catch (error) {
		res.status(400).json({ success: false });
	}
};

// @desc    Get a single nonprofit
// @route   GET /api/v1/nonprofits/:id
// @access  Private
exports.getNonprofit = async (req, res, next) => {
	try {
		const nonprofit = await Nonprofit.findById(req.params.id);
		res.status(200).json({
			success: true,
			data: nonprofit,
		});
		if (!nonprofit) {
			// checks for null and by extension checks for properly formatted id
			return res.status(400).json({ success: false });
		}
	} catch (error) {
		res.status(400).json({ success: false });
	}
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
exports.updateNonprofit = async (req, res, next) => {
	try {
		const nonprofit = await Nonprofit.findByIdAndUpdate(
			req.params.id,
			req.body,
			{
				new: true,
				runValidators: true,
			}
		);
		if (!nonprofit) {
			return res.status(400).json({ success: false });
		}
		res.status(200).json({
			success: true,
			data: nonprofit,
		});
	} catch (error) {
		res.status(400).json({ success: false })
	}
	
};

// @desc    Delete a nonprofit
// @route   DELETE /api/v1/nonprofits
// @access  Private
exports.deleteNonprofit = async (req, res, next) => {
	try {
		const nonprofit = await Nonprofit.findByIdAndDelete(
			req.params.id,
		);
		if (!nonprofit) {
			return res.status(400).json({ success: false });
		}
		res.status(200).json({
			success: true,
			data: {}
		});
	} catch (error) {
		res.status(400).json({ success: false })
	}
};
