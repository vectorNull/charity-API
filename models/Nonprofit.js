const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require("../utils/geocoder");

const NonprofitSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        slug: String,
        email: {
            type: String,
            required: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Please add a valid email",
            ],
        },
        website: {
            type: String,
            match: [
                /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
                "Please use a valid URL with HTTP or HTTPS",
            ],
        },
        guideStarAddress: {
            type: String,
            match: [
                /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
                "Please use a valid URL with HTTP or HTTPS",
            ],
        },
        phone: {
            type: String,
            maxlength: [
                20,
                "Phone number can not be longer than 20 characters",
            ],
        },
        ein: {
            type: String,
            required: [true, "Please enter a valid EIN number"],
        },
        president: {
            type: String,
            maxlength: 200,
        },
        address: {
            type: String,
            required: true,
        },
        location: {
            // GeoJSON Point
            type: {
                type: String,
                enum: ["Point"],
            },
            coordinates: {
                type: [Number],
                index: "2dsphere",
            },
            formattedAddress: String,
            street: String,
            city: String,
            state: String,
            zipcode: String,
            country: String,
        },
        photo: {
            type: String,
            default: "no-photo.jpg",
        },
        description: {
            type: String,
            //required: true,
        },
        nteeCodes: {
            type: Array,
            nteeCode: {
                type: Object,
            },
        },
        verified: {
            type: Boolean,
            default: false,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            //required: true,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Create nonprofit slug from the name
NonprofitSchema.pre("save", function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// Goecode and create location field
NonprofitSchema.pre("save", async function (next) {
    const loc = await geocoder.geocode(this.address);
    this.location = {
        type: "Point",
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        street: loc[0].streetName,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].zipcode,
        country: loc[0].countryCode,
    };

    // Do not save address in db
    this.address = undefined;
    next();
});

// Cascade delete programs when deleting nonprofit
NonprofitSchema.pre("remove", async function (next) {
    await this.model("Program").deleteMany({ nonprofitId: this._id });
    next();
});

// Reverse populate with virtuals
NonprofitSchema.virtual("programs", {
    ref: "Program",
    localField: "_id",
    foreignField: "nonprofitId",
    justOne: false,
});

module.exports = mongoose.model("Nonprofit", NonprofitSchema);
