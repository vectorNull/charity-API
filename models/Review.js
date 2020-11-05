const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a title for the review'],
        maxlength: 100,
    },
    text: {
        type: String,
        required: [true, 'Please add a review'],
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: [true, 'Please add a rating between 1 and 10'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    nonprofitId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Nonprofit',
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
});

// Keeps users from submitting more than one review per nonprofit
ReviewSchema.index({ nonprofit: 1, user: 1 }, { unique: true });

// Static method to get avg rating and save
ReviewSchema.statics.getAverageRating = async function (nonprofitId) {
    const obj = await this.aggregate([
        {
            $match: { nonprofit: nonprofitId },
        },
        {
            $group: {
                _id: '$nonprofit',
                averageRating: { $avg: '$rating' },
            },
        },
    ]);

    try {
        await this.model('Nonprofit').findByIdAndUpdate(nonprofitId, {
            averageRating: obj[0].averageRating,
        });
    } catch (err) {
        console.error(err);
    }
};

// Call getAverageRating after save
ReviewSchema.post('save', async function () {
    await this.constructor.getAverageRating(this.nonoprofit);
});

// Call getAverageRating before remove
ReviewSchema.post('remove', async function () {
    await this.constructor.getAverageRating(this.nonoprofit);
});

module.exports = mongoose.model('Review', ReviewSchema);