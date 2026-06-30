import Review from '../models/Review.js';
import Product from '../models/Product.js';

export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name avatar');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const { productId, rating, comment, images } = req.body;
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user already reviewed
    const alreadyReviewed = await Review.findOne({ user: req.user._id, product: productId });
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Product already reviewed' });
    }

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating: Number(rating),
      comment,
      images: images || [],
    });

    const io = req.app.get('io');
    if (io) {
      io.emit('new_review', {
        reviewId: review._id,
        rating: review.rating,
        comment: review.comment,
        productName: product.name,
        customerName: req.user.name,
      });
    }

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const replyToReview = async (req, res) => {
  try {
    const { reply } = req.body;
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.reply = reply;
    await review.save();
    const io = req.app.get('io');
    if (io) {
      io.emit('review_reply', {
        reviewId: review._id,
        reply: review.reply,
      });
    }
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
