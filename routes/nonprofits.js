const express = require('express');
const router = express.Router();

// Deconstruct controllers
const {
	getNonprofits,
	getNonprofit,
	addNonprofit,
	updateNonprofit,
	deleteNonprofit,
} = require('../controllers/nonprofits');

// Root routes
router.route('/')
    .get(getNonprofits)
    .post(addNonprofit);

// Routes requiring id
router
	.route('/:id')
	.get(getNonprofit)
	.put(updateNonprofit)
	.delete(deleteNonprofit);

module.exports = router;
