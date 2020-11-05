const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
// Deconstruct controllers
const {
    getNonprofits,
    getNonprofit,
    createNonprofit,
    updateNonprofit,
    deleteNonprofit,
    getNonprofitsInRadius,
    nonprofitPhotoUpload,
} = require('../controllers/nonprofits');

const Nonprofit = require('../models/Nonprofit');
const advancedResults = require('../middleware/advancedResults');

// Include other resource routers
const programRouter = require('./programs');
const reviewRouter = require('./reviews');

// re-route into other resource routers
router.use('/:nonprofitId/programs', programRouter);
router.use('/:nonprofitId/reviews', reviewRouter);

// Geo route
router.route('/radius/:zipcode/:distance').get(getNonprofitsInRadius);

// Upload photo route
router
    .route('/:id/photo')
    .put(protect, authorize('publisher', 'admin'), nonprofitPhotoUpload);

// Root routes
router
    .route('/')
    .get(advancedResults(Nonprofit, 'programs'), getNonprofits)
    .post(protect, authorize('publisher', 'admin'), createNonprofit);

// Routes requiring id
router
    .route('/:id')
    .get(getNonprofit)
    .put(protect, authorize('publisher', 'admin'), updateNonprofit)
    .delete(protect, authorize('publisher', 'admin'),deleteNonprofit);

module.exports = router;
