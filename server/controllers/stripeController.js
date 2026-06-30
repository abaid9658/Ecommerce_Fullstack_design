import Stripe from 'stripe';
import Cart from '../models/Cart.js';

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_stripe_key_123');

// @desc    Create Stripe Checkout Session
// @route   POST /api/stripe/create-checkout-session
// @access  Private
export const createCheckoutSession = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty' });
    }

    const lineItems = cart.items.map((item) => {
      const unitAmount = Math.round(item.product.price * 100); // Stripe expects cents
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product.name,
            images: [item.product.image],
            description: item.product.shortDescription || 'eCommerce Product',
          },
          unit_amount: unitAmount,
        },
        quantity: item.quantity,
      };
    });

    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/cart?status=success`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/cart?status=cancel`,
      metadata: {
        userId: req.user._id.toString(),
      },
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Stripe Webhook Handler
// @route   POST /api/stripe/webhook
// @access  Public (Called by Stripe)
export const webhookHandler = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    const rawBody = req.body; // Needs express.raw() parsing configured in server.js
    event = stripeInstance.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || 'whsec_mock_key'
    );
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful payments
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.userId;

    try {
      // Clear Cart on successful checkout
      await Cart.findOneAndUpdate({ user: userId }, { items: [] });
      console.log(`Successfully completed order for User: ${userId}. Cart cleared.`);
    } catch (err) {
      console.error(`Error clearing cart on webhook: ${err.message}`);
    }
  }

  res.json({ received: true });
};
