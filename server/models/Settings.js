import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      default: 'Brand eCommerce',
    },
    email: {
      type: String,
      default: 'info@brandstore.com',
    },
    contactNumber: {
      type: String,
      default: '+1-555-0199',
    },
    address: {
      type: String,
      default: '123 Retail Ave, New York, NY',
    },
    taxRate: {
      type: Number,
      default: 0.05, // 5%
    },
    shippingCharge: {
      type: Number,
      default: 10.0,
    },
    codEnabled: {
      type: Boolean,
      default: true,
    },
    stripeEnabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
