const mongoose = require("mongoose");

const Product = mongoose.model(
    "Product",
    new mongoose.Schema({
        title: {
            type: String,
            trim: String,
            required: [true, 'Product Name cannot be blank.'],
            minlength: [3, 'Must be at least 3 characters.'],
            maxlength: [50, 'Must be less than 50 characters.']
        },
        Price: {
            type: Number,
            required: [true, 'Price cannot be blank.'],
        },
        Description: {
            type: String,
            trim: String,
            maxlength: [250, 'Must be less than 50 characters.']
        },
        // images: [],
        ImageLink: String,
        // comments: [
        //     {
        //         type: mongoose.Schema.Types.ObjectId,
        //         ref: "Comment"
        //     }
        // ],
        CategoryNameId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CategoryName",
        },
        Quantity: {
            type: Number,
            required: [true, 'Quantity cannot be blank.'],
        },

        CategoryName: String,
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    }, {
        timestamps: true
    }
    ));

module.exports = Product;