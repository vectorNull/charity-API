const express = require('express');
const router = express.Router();

// Deconstruct controllers
const {
	getNonprofits,
	getNonprofit,
	createNonprofit,
	updateNonprofit,
	deleteNonprofit,
} = require('../controllers/nonprofits');

// Root routes
router.route('/')
    .get(getNonprofits)
    .post(createNonprofit);

// Routes requiring id
router
	.route('/:id')
	.get(getNonprofit)
	.put(updateNonprofit)
	.delete(deleteNonprofit);

module.exports = router;
