import Settings from '../models/Settings.js';

export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({});
    if (!settings) {
      // Create defaults
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = new Settings({});
    }

    const { storeName, email, contactNumber, address, taxRate, shippingCharge, codEnabled, stripeEnabled } = req.body;

    settings.storeName = storeName !== undefined ? storeName : settings.storeName;
    settings.email = email !== undefined ? email : settings.email;
    settings.contactNumber = contactNumber !== undefined ? contactNumber : settings.contactNumber;
    settings.address = address !== undefined ? address : settings.address;
    settings.taxRate = taxRate !== undefined ? Number(taxRate) : settings.taxRate;
    settings.shippingCharge = shippingCharge !== undefined ? Number(shippingCharge) : settings.shippingCharge;
    settings.codEnabled = codEnabled !== undefined ? Boolean(codEnabled) : settings.codEnabled;
    settings.stripeEnabled = stripeEnabled !== undefined ? Boolean(stripeEnabled) : settings.stripeEnabled;

    await settings.save();
    const io = req.app.get('io');
    if (io) {
      io.emit('settings_update', settings);
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
