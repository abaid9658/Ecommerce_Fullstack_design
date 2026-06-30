import Product from '../models/Product.js';

// @desc    Get all products with searching, filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      brand,
      features,
      minPrice,
      maxPrice,
      rating,
      condition,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    // 1. Text Search (using index or regular expressions)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    // 2. Category Filter
    if (category) {
      const categoriesArray = category.split(',');
      query.category = { $in: categoriesArray };
    }

    // 3. Brand Filter
    if (brand) {
      const brandsArray = brand.split(',');
      query.brand = { $in: brandsArray.map(b => new RegExp(`^${b.trim()}$`, 'i')) };
    }

    // 4. Features Filter
    if (features) {
      const featuresArray = features.split(',');
      query.features = { $all: featuresArray };
    }

    // 5. Price Range Filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // 6. Rating Filter
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    // 7. Condition Filter
    if (condition && condition !== 'Any') {
      query.condition = condition;
    }

    // Sort options
    let sortOptions = { createdAt: -1 }; // default: newest
    if (sort) {
      switch (sort) {
        case 'price-asc':
          sortOptions = { price: 1 };
          break;
        case 'price-desc':
          sortOptions = { price: -1 };
          break;
        case 'rating':
          sortOptions = { rating: -1 };
          break;
        case 'popular':
          sortOptions = { orderCount: -1 };
          break;
        case 'featured':
          sortOptions = { isFeatured: -1, createdAt: -1 };
          break;
        default:
          sortOptions = { createdAt: -1 };
      }
    }

    // Pagination
    const skipCount = (Number(page) - 1) * Number(limit);

    // Get count and data
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skipCount)
      .limit(Number(limit));

    res.json({
      products,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true }).limit(10);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get deal products
// @route   GET /api/products/deals
// @access  Public
export const getDealProducts = async (req, res) => {
  try {
    const products = await Product.find({ isOnDeal: true }).limit(5);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get related products by category
// @route   GET /api/products/:id/related
// @access  Public
export const getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    }).limit(6);

    res.json(related);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send inquiry for a product
// @route   POST /api/products/:id/inquiry
// @access  Public
export const sendProductInquiry = async (req, res) => {
  try {
    const { name, email, message, quantity } = req.body;
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Usually we would send an email here or save an Inquiry model
    // For now, we simulate a successful inquiry transmission
    console.log(`Inquiry sent for ${product.name} by ${email}`);
    
    // In a real scenario, you'd send a Socket.io event to admin
    if (req.app.get('io')) {
      req.app.get('io').emit('new_inquiry', { 
        productName: product.name, 
        customerName: name, 
        message 
      });
    }

    res.status(200).json({ message: 'Inquiry sent successfully to the supplier.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const createdProduct = await product.save();
    const io = req.app.get('io');
    if (io) {
      io.emit('product_change', { action: 'create', product: createdProduct });
    }
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      // Update fields dynamically
      Object.keys(req.body).forEach((key) => {
        product[key] = req.body[key];
      });

      const updatedProduct = await product.save();
      const io = req.app.get('io');
      if (io) {
        io.emit('product_change', { action: 'update', product: updatedProduct });
      }
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: req.params.id });
      const io = req.app.get('io');
      if (io) {
        io.emit('product_change', { action: 'delete', id: req.params.id });
      }
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
