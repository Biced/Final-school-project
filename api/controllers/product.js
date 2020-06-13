const {
    NotFoundInCatch,
    error500,
    error404,
    error422
} = require("../lib/error");
const {
    getAllResponse,
    createResponse,
    updateResponse,
    getOneResponse,
    response
} = require("../lib/response");
// const mongoose = require('mongoose');

const db = require("../models");
const Product = require("../models/Product");
const CategoryNameSchema = require("../models/Category");



// get products by category needs work names changed

const allByCategoryId = (req, res, next) => {
    console.log(req.query.id);
    db.Product.find({ category: req.query.id })
        .populate("category", "name -_id")
        .then(product => {
            getAllResponse(res, product);
        })
        .catch(err => {
            error500(
                res,
                err.message || "Some error occurred while retrieving product."
            );
        });
}

// create product and category and check if a category with this name already exists

const create = (req, res, next) => {
    var obj = req.body;
    let CategoryName = { name: obj.CategoryName };
    var id;

    const newCategoryName = new CategoryNameSchema(CategoryName);
    CategoryNameSchema.findOne({ name: obj.CategoryName }, async function (err, docCategory) {
        if (docCategory == null) {
            await newCategoryName
                .save().then(res => {
                    id = res._id;
                }).catch(err => { throw err });
            productFunc(id, obj, res);
        } else {
            id = docCategory._id;
            productFunc(id, obj, res);
        }
    });

}
const productFunc = (id, obj, x) => {
    const product = new Product(obj)
    product.CategoryNameId = id;
    return product
        .save().then(product => {
            createResponse(x, product, "Product Created Successfully");
        })
        .catch(err => {
            error422(x, err);
            // need to see what is going on with all this mess
            error500(
                x,
                err.message || "Some error occurred while creating the product."
            );
        });
};

//  get all products
const findAll = (req, res, next) => {
    console.log('HI REQ FILTER' + req);
    Product.find()
        // optional filter and category logic
        .where(filter)
        // .populate('category')
        //   .populate('Origin')
        .then(product => {
            getAllResponse(res, product);
        })
        .catch(err => {
            error500(
                res,
                err.message || "Some error occurred while retrieving product."
            );
        });
};


//  find one by id @ /:id. **** has promise error if deleted. ****
const findOne = (req, res, next) => {

    Product.findById(req.params.id)
        //   .populate('Category')
        //   .populate('Origin')
        .then(product => {
            if (!product) error404(res, "Product not found with id " + req.params.id);
            getOneResponse(res, product);
        })
        .catch(err => {
            NotFoundInCatch(res, err, `Product not found with id ${err.value}`);
            error500(res, `Error retrieving product with id ${err.value}`);
        });
};


//  update one
const update = (req, res, next) => {
    Product.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true })
        .then(product => {
            if (!product) error404(res, "Product not found with id " + req.params.id);
            updateResponse(res, product, 'Product updated successfully');
        })
        .catch(err => {
            NotFoundInCatch(res, err, `Product not found with id ${err.value}`);
            error500(res, `Error updating product with id ${err.value}`);
        });
};

//  delete one
const deleteProduct = (req, res, next) => {
    Product.findByIdAndRemove(req.params.id)
        .then(product => {
            if (!product) error404(res, "Product not found with id " + req.params.id);
            response(res, "Product deleted successfully!");
        })
        .catch(err => {
            NotFoundInCatch(res, err, `Product not found with id ${err.value}`);
            error500(res, `Could not delete product with id ${err.value}`);
        });
};

const getProduct = (req, res, next) => {
    const filter = req.body.filter || '';
    const sort = {
        [req.body.sortKey || "_id"]: req.body.sortOrder || 1
    };
    const pageOptions = {
        page: req.body.page || 0,
        limit: req.body.limit || 10
    }
    Product.find()
        .where(filter)
        .sort(sort)
        .skip(pageOptions.page * pageOptions.limit)
        .limit(pageOptions.limit)
        // .populate('CategoryNameId')
        .then(products => {
            console.log(products);
            console.log(filter);
            Product.collection.countDocuments(filter).then(totalCount => {
                const data = {

                    products,
                    totalCount,
                    ...pageOptions
                };
                getAllResponse(res, data);
            });
            console.log('<<<<<<<<<<<<<hi>>>>>>>')
        })
        .catch(err => {
            error500(
                res,
                err.message || "Some error occurred while retrieving product."
            );
        });
};
module.exports = {
    create,
    allByCategoryId,
    findAll,
    findOne,
    update,
    delete: deleteProduct,
    getProduct
};




// const create = (req, res, next) => {
//     const product = new Product(req.body)
// product
//     .save()
//     .then(product => {
//         createResponse(res, product);
//     })
//     .catch(err => {
//         error422(res, err);
//         error500(
//             res,
//             err.message || "Some error occurred while creating the product."
//         );
//     });
// res = req.body;
// };



