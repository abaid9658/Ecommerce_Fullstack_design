import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// Helper to populate product data in Cart
const populateCart = async (userId) => {
  return await Cart.findOne({ user: userId })
    .populate('items.product')
    .populate('savedForLater');
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    let cart = await populateCart(req.user._id);
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
export const addToCart = async (req, res) => {
  const { productId, quantity, selectedColor, selectedSize, material } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if item already exists in cart with same configurations
    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.selectedColor === (selectedColor || '') &&
        item.selectedSize === (selectedSize || '')
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += Number(quantity || 1);
    } else {
      // Push new item
      cart.items.push({
        product: productId,
        quantity: Number(quantity || 1),
        selectedColor: selectedColor || '',
        selectedSize: selectedSize || '',
        material: material || ''
      });
    }

    await cart.save();
    const populated = await populateCart(req.user._id);
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/items/:productId
// @access  Private
export const updateCartItem = async (req, res) => {
  const { quantity, selectedColor, selectedSize } = req.body;
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.selectedColor === (selectedColor || '') &&
        item.selectedSize === (selectedSize || '')
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = Number(quantity);
      await cart.save();
      const populated = await populateCart(req.user._id);
      res.json(populated);
    } else {
      res.status(404).json({ message: 'Item not found in cart' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:productId
// @access  Private
export const removeFromCart = async (req, res) => {
  const { productId } = req.params;
  const { selectedColor, selectedSize } = req.query;

  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (item) =>
        !(
          item.product.toString() === productId &&
          item.selectedColor === (selectedColor || '') &&
          item.selectedSize === (selectedSize || '')
        )
    );

    await cart.save();
    const populated = await populateCart(req.user._id);
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Move item to save for later list
// @route   POST /api/cart/save-for-later/:productId
// @access  Private
export const saveForLater = async (req, res) => {
  const { productId } = req.params;
  const { selectedColor, selectedSize } = req.body;

  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Add to saved list if not already there
    if (!cart.savedForLater.includes(productId)) {
      cart.savedForLater.push(productId);
    }

    // Remove from active cart items
    cart.items = cart.items.filter(
      (item) =>
        !(
          item.product.toString() === productId &&
          item.selectedColor === (selectedColor || '') &&
          item.selectedSize === (selectedSize || '')
        )
    );

    await cart.save();
    const populated = await populateCart(req.user._id);
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Move item from saved list back to active cart
// @route   POST /api/cart/move-to-cart/:productId
// @access  Private
export const moveToCart = async (req, res) => {
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Remove from saved list
    cart.savedForLater = cart.savedForLater.filter(
      (id) => id.toString() !== productId
    );

    // Add to active items if not already there
    const itemExists = cart.items.some((item) => item.product.toString() === productId);
    if (!itemExists) {
      cart.items.push({
        product: productId,
        quantity: 1,
        selectedColor: '',
        selectedSize: '',
        material: ''
      });
    }

    await cart.save();
    const populated = await populateCart(req.user._id);
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    const populated = await populateCart(req.user._id);
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
