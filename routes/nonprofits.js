const express = require('express');
const router = express.Router();
const {
	getNonprofits,
	getNonprofit,
	addNonprofit,
	updateNonprofit,
	deleteNonprofit,
} = require('../controllers/nonprofits');


router.route('/')
    .get(getNonprofits)
    .post(addNonprofit);

router
	.route('/:id')
	.get(getNonprofit)
	.put(updateNonprofit)
	.delete(deleteNonprofit);

module.exports = router;
