import mongoose from 'mongoose';

const tieredPricingSchema = new mongoose.Schema({
  minQty: { type: Number, required: true },
  maxQty: { type: Number, required: true },
  price: { type: Number, required: true }
}, { _id: false });

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  verified: { type: Boolean, default: false }
}, { _id: false });

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Please add a product price'],
      default: 0.0,
    },
    originalPrice: {
      type: Number,
      default: 0.0,
    },
    image: {
      type: String,
      required: [true, 'Please add a main product image URL'],
    },
    images: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      required: [true, 'Please add a product description'],
    },
    shortDescription: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Please add a product category'],
      trim: true,
    },
    subcategory: {
      type: String,
      default: '',
    },
    brand: {
      type: String,
      required: [true, 'Please add a product brand'],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, 'Please add stock quantity'],
      default: 0,
    },
    rating: {
      type: Number,
      default: 0.0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    orderCount: {
      type: Number,
      default: 0,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    features: {
      type: [String],
      default: [],
    },
    specs: {
      type: Map,
      of: String,
      default: {},
    },
    tieredPricing: {
      type: [tieredPricingSchema],
      default: [],
    },
    supplier: {
      type: supplierSchema,
      default: () => ({ name: 'Guanjoi Trading LLC', country: 'CN', verified: true })
    },
    condition: {
      type: String,
      enum: ['Any', 'Refurbished', 'Brand new', 'Old items'],
      default: 'Brand new',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isOnDeal: {
      type: Boolean,
      default: false,
    },
    dealDiscount: {
      type: Number,
      default: 0,
    },
    colors: {
      type: [String],
      required: [true, 'Please add product colors'],
      default: [],
    },
    sizes: {
      type: [String],
      required: [true, 'Please add product sizes'],
      default: [],
    }
  },
  {
    timestamps: true,
  }
);

// Add Text Index for Search Bar
productSchema.index({
  name: 'text',
  description: 'text',
  category: 'text',
  brand: 'text'
});

const Product = mongoose.model('Product', productSchema);

export default Product;
