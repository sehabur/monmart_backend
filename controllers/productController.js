const createError = require('http-errors');

const Product = require('../models/productModel');

/*
  @api:       GET /api/products/
  @desc:      get all prducts
  @access:    public
*/
const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({});
    if (products) {
      res.json({ products });
    } else {
      const error = createError(404, 'No Product Found');
      next(error);
    }
  } catch (err) {
    const error = createError(500, 'No Products Found');
    next(error);
  }
};

/*
  @api:       GET /api/products/:id
  @desc:      get a prduct by its Id
  @access:    public
*/
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).exec();
    if (product) {
      // setTimeout(() => {
      //   res.json({ product });
      // }, 3000);
      res.json({ product });
    } else {
      const error = createError(404, 'No Product Found with the Id Provided');
      next(error);
    }
  } catch (err) {
    const error = createError(500, 'No Products Found');
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
};
