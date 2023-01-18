import slugify from 'slugify';
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A product name must be provided'],
  },
  slug: String,
  price: {
    type: Number,
    required: [true, 'A product price must be provided'],
  },
  featured: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must not be below 1.0'],
    max: [5, 'Rating must not be above 5.0'],
  },
  company: {
    type: String,
    enum: {
      values: ['ikea', 'liddy', 'caressa', 'marcos'],
      message: '{VALUE} is not supported',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

productSchema.index({ price: 1, rating: -1 });
productSchema.index({ slug: 1 });

productSchema.pre('save', async function (next) {
  if (!this.isModified('name')) return next();
  this.slug = slugify(this.name, { lower: true });

  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const productWithSlug = await this.constructor.find({ slug: slugRegEx });

  if (productWithSlug.length) {
    this.slug = `${this.slug}-${productWithSlug.length + 1}`;
  }
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
