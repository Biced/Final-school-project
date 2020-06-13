

// mongoose
// .connect("mongodb://localhost/bezkoder_db", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
// .then(() => console.log("Successfully connect to MongoDB."))
// .catch(err => console.error("Connection error", err));

const db = require("./api/models");


//  create Product function
const createTutorial = function (Product) {
    return db.Product.create(Product).then(docProduct => {
        console.log("\n>> Created Product:\n", docProduct);
        return docProduct;
    });
};


// create/push image to product function
const createImage = function (ProductId, image) {
    console.log("\n>> Add Image:\n", image);
    return db.Product.findByIdAndUpdate(
        ProductId,
        {
            $push: {
                images: {
                    url: image.url,
                    caption: image.caption
                }
            }
        },
        { new: true, useFindAndModify: false }
    );
};


//
// function that creates a comment
const createComment = function (ProductId, comment) {
    return db.Comment.create(comment).then(docComment => {
        console.log("\n>> Created Comment:\n", docComment);

        return db.Product.findByIdAndUpdate(
            ProductId,
            { $push: { comments: docComment._id } },
            { new: true, useFindAndModify: false }
        );
    });
};


// Create category


const createCategory = function (category) {

    // check to see if a category by this name exists if it does return it if not create a new one a nd return it.
    return db.Category.findOne({ name: 'Node.js' }, function (err, docCategory) {
        console.log(docCategory)
        if (docCategory != null) {
            return docCategory;
        } else {
            return db.Category.create(category).then(docCategory => {
                console.log("\n>> Created Category:\n", docCategory);
                return docCategory;
            });
        }
    });


};
// add Product to category
const addTutorialToCategory = function (ProductId, categoryId) {
    return db.Product.findByIdAndUpdate(
        ProductId,
        { category: categoryId },
        { new: true, useFindAndModify: false }
    );
};
// get all products by category
const getTutorialsInCategory = function (categoryId) {
    return db.Product.find({ category: categoryId })
        .populate("category", "name -_id");
    // optinal parameters on return
    // .select("-comments -images -__v");
};



// run a test function with test data
const run = async function () {

    // calls Product function
    var Product = await createTutorial({
        title: "Tutorial #1",
        author: "bezkoder",
        price: 100,
        description: "aksajld kjasldjlasjkd kjsadlkajslkd"
    });


    // calls Img function
    Product = await createImage(Product._id, {
        path: "sites/uploads/images/mongodb.png",
        url: "/images/mongodb.png",
        caption: "MongoDB Database",
        createdAt: Date.now()
    });
    console.log("\n>> Product:\n", Product);
    // calls Img function
    Product = await createImage(Product._id, {
        path: "sites/uploads/images/one-to-many.png",
        url: "/images/one-to-many.png",
        caption: "One to Many Relationship",
        createdAt: Date.now()
    });
    console.log("\n>> Product:\n", Product);

    // calls category function
    var category = await createCategory({
        name: "Node.js",
        description: "Node.js tutorial"
    });

    // calls comment function
    Product = await createComment(Product._id, {
        username: "jack",
        text: "This is a great tutorial.",
        rating: 4,
        createdAt: Date.now()
    });
    console.log("\n>> Tutorial:\n", Product);

    // calls comment function
    Product = await createComment(Product._id, {
        username: "mary",
        text: "Thank you, it helps me alot.",
        rating: 5,
        createdAt: Date.now()
    });
    console.log("\n>> Tutorial:\n", Product);

    // adds the Product to the category function
    Product = await addTutorialToCategory(Product._id, category._id);
    console.log("\n>> Tutorial:\n", Product);

    // get all producst in category
    var Products = await getTutorialsInCategory(category._id);
    console.log("\n>> all Tutorials in Cagetory:\n", Products);
};

run();