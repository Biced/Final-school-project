const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');

// get all by category
router.get('/', productController.allByCategoryId);

// get all with filters
router.get('/all', productController.findAll);
router.post('/all', productController.getProduct);

router.put('/create', productController.create);

// router.post('/:id', productController.create);

router.get('/:id', productController.findOne);
// update single
router.post('/:id', productController.update);

router.delete('/:id', productController.delete);

module.exports = router;