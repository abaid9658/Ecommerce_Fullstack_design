import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: { type: Number, required: true },
  selectedColor: { type: String, default: '' },
  selectedSize: { type: String, default: '' },
  price: { type: Number, required: true },
}, { _id: false });

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['stripe', 'cod', 'bank'],
      default: 'stripe',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    discountAmount: {
      type: Number,
      default: 0.0,
    },
    taxAmount: {
      type: Number,
      default: 0.0,
    },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    trackingNumber: {
      type: String,
      default: '',
    },
    trackingHistory: [
      {
        status: { type: String, required: true },
        location: { type: String, default: '' },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Set tracking number uids before saving
orderSchema.pre('save', function (next) {
  if (!this.trackingNumber) {
    this.trackingNumber = 'TRK' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
