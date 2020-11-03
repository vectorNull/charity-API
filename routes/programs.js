const express = require('express');
const { protect, authorize } = require('../middleware/auth');

// Deconstruct controllers
const {
    getPrograms,
    getProgram,
    addProgram,
    updateProgram,
    deleteProgram,
} = require('../controllers/programs');

const Program = require('../models/Program');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(
        advancedResults(Program, {
            path: 'nonprofitId',
            select: 'name description',
        }),
        getPrograms
    )
    .post(protect, authorize('publisher', 'admin'), addProgram);
router
    .route('/:id')
    .get(getProgram)
    .put(protect, authorize('publisher', 'admin'), updateProgram)
    .delete(protect, authorize('publisher', 'admin'), deleteProgram);

module.exports = router;
