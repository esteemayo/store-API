const { StatusCodes } = require('http-status-codes');

const Product = require('../models/Product');
const catchError = require('../utils/catchError');
const NotFoundError = require('../errors/notFound');

exports.getAllProducts = catchError(async (req, res, next) => {
  const { name, featured, sort, fields, numericFilter } = req.query;
  const queryObj = {};

  // filter by name
  if (name) {
    queryObj.name = { $regex: name, $options: 'i' };
  }

  // filter by featured
  if (featured) {
    queryObj.featured = featured === 'true' ? true : false;
  }

  // advanced filtering
  if (numericFilter) {
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    };

    const regEx = /\b(<|>|>=|=|<=)\b/g;
    let filters = numericFilter.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    // console.log(filters);
    const options = ['price', 'rating'];

    filters = filters.split(',').forEach((item) => {
      const [field, operator, value] = item.split('-');

      if (options.includes(field)) {
        queryObj[field] = { [operator]: Number(value) };
      }
    });
  }

  let query = Product.find(queryObj);

  // sorting
  if (sort) {
    const sortsList = sort.split(',').join(' ');
    query = query.sort(sortsList);
  } else {
    query = query.sort('-createdAt');
  }

  // fields limiting
  if (fields) {
    const fieldsList = fields.split(',').join(' ');
    query = query.select(fieldsList);
  } else {
    query = query.select('-__v');
  }

  // pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  const products = await query;

  res.status(StatusCodes.OK).json({
    status: 'success',
    requestedAt: req.requestTime,
    counts: products.length,
    products,
  });
});

exports.getProductById = catchError(async (req, res, next) => {
  const { id: prodID } = req.params;

  const product = await Product.findById(prodID);

  if (!product) {
    return next(new NotFoundError(`No product found with that ID: ${prodID}`));
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    product,
  });
});

exports.getProductBySlug = catchError(async (req, res, next) => {
  const { slug } = req.params;

  const product = await Product.findOne({ slug: slug });

  if (!product) {
    return next(new NotFoundError(`No product found with that SLUG: ${slug}`));
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    product,
  });
});

exports.createProduct = catchError(async (req, res, next) => {
  const product = await Product.create({ ...req.body });

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    product,
  });
});

exports.updateProduct = catchError(async (req, res, next) => {
  const { id: prodID } = req.params;

  const product = await Product.findByIdAndUpdate(prodID, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return next(new NotFoundError(`No product found with that ID: ${prodID}`));
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    product,
  });
});

exports.deleteProduct = catchError(async (req, res, next) => {
  const { id: prodID } = req.params;

  const product = await Product.findByIdAndDelete(prodID);

  if (!product) {
    return next(
      new NotFoundError(`No product found with that ID: ${prodID}`, 404)
    );
  }

  res.status(StatusCodes.NO_CONTENT).json({
    status: 'success',
    product: null,
  });
});
