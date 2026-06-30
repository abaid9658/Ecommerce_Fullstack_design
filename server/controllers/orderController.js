import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name images price')
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const trackOrder = async (req, res) => {
  try {
    const { id } = req.params;
    // Try to find by MongoDB ID or tracking number
    let order = null;
    if (id.length === 24) {
      order = await Order.findById(id).populate('items.product', 'name images');
    }
    if (!order) {
      order = await Order.findOne({ trackingNumber: id.toUpperCase() })
        .populate('items.product', 'name images');
    }
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { items, paymentMethod, shippingAddress, totalAmount, discountAmount, taxAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    // Check stock availability
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for product: ${product?.name || 'Unknown'}` });
      }
    }

    // Deduct stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, orderCount: item.quantity },
      });
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      paymentMethod,
      shippingAddress,
      totalAmount,
      discountAmount: discountAmount || 0,
      taxAmount: taxAmount || 0,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid', // cod is pending, others mock paid
      trackingHistory: [{ status: 'pending', location: 'Warehouse' }],
    });

    // Realtime notification
    const io = req.app.get('io');
    if (io) {
      io.emit('new_sale', {
        orderId: order._id,
        amount: order.totalAmount,
        customerName: req.user.name,
      });
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status, location } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    order.trackingHistory.push({ status, location: location || 'Transit Depot' });
    await order.save();

    // Realtime order status push
    const io = req.app.get('io');
    if (io) {
      io.emit('order_status_update', {
        orderId: order._id,
        userId: order.user,
        status: order.status,
        trackingHistory: order.trackingHistory,
      });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const exportReport = async (req, res) => {
  try {
    const orders = await Order.find({});
    const totalEarnings = orders.reduce((acc, o) => acc + o.totalAmount, 0);
    const count = orders.length;

    res.json({
      totalEarnings,
      totalOrders: count,
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
