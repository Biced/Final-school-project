const mongoose = require("mongoose");

// const Category = mongoose.model(
//     "Category",
//     new mongoose.Schema({
//         name: String,
//         description: String
//     })
// );

// module.exports = Category;
const CategoryName = mongoose.model(
    "CategoryName",
    new mongoose.Schema({
        name: String,
    })
);

module.exports = CategoryName;