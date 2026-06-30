import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Cart from '../models/Cart.js';

dotenv.config();

const products = [
  // Category: Electronics
  {
    name: 'Canon Camera EOS 2000D, Black 18-55mm Lens Kit',
    price: 998.00,
    originalPrice: 1128.00,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=500&auto=format&fit=crop&q=60'
    ],
    description: 'Capture beautiful detailed photos and cinematic Full HD movies with ease. 24.1 Megapixel sensor, Wi-Fi connectivity, and built-in Guide Mode make this the perfect starting camera for beginners.',
    shortDescription: '24.1 MP DSLR camera with EF-S 18-55mm lens kit, built-in Wi-Fi.',
    category: 'Electronics',
    subcategory: 'Cameras',
    brand: 'Canon',
    stock: 25,
    rating: 4.5,
    reviewCount: 154,
    orderCount: 432,
    freeShipping: true,
    features: ['Metallic', 'Large Memory', 'Super power'],
    specs: {
      model: 'EOS 2000D',
      style: 'DSLR Kit',
      certificate: 'ISO-9001',
      size: '129.0 x 101.3 x 77.6 mm',
      memory: 'SDHC/SDXC Support'
    },
    tieredPricing: [
      { minQty: 1, maxQty: 10, price: 998.00 },
      { minQty: 11, maxQty: 50, price: 950.00 },
      { minQty: 51, maxQty: 1000, price: 900.00 }
    ],
    supplier: { name: 'Canon Official Outlet', country: 'Germany', verified: true },
    condition: 'Brand new',
    isFeatured: true,
    isOnDeal: true,
    dealDiscount: 12
  },
  {
    name: 'GoPro HERO12 Black Action Camera - Waterproof 4K',
    price: 399.00,
    originalPrice: 449.00,
    image: 'https://images.unsplash.com/photo-1565849210600-79f415057729?w=500&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1565849210600-79f415057729?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1524824841637-ac4c84024df7?w=500&auto=format&fit=crop&q=60'
    ],
    description: 'GoPro HERO12 features custom HDR video recording, HyperSmooth 6.0 video stabilization, and a wider lens angle. Designed for adventure sports and travel content creation.',
    shortDescription: 'High resolution 5.3K video, extreme stabilization, waterproof up to 33ft.',
    category: 'Electronics',
    subcategory: 'Cameras',
    brand: 'GoPro',
    stock: 45,
    rating: 4.8,
    reviewCount: 324,
    orderCount: 1250,
    freeShipping: true,
    features: ['Plastic cover', 'Super power', 'Super resolution'],
    specs: {
      model: 'HERO12 Black',
      style: 'Action Cam',
      certificate: 'CE Approved',
      size: '71.8 x 50.8 x 33.6 mm',
      memory: 'MicroSD Class 10'
    },
    tieredPricing: [
      { minQty: 1, maxQty: 5, price: 399.00 },
      { minQty: 6, maxQty: 20, price: 380.00 },
      { minQty: 21, maxQty: 500, price: 360.00 }
    ],
    supplier: { name: 'Action Gear Ltd', country: 'United States', verified: true },
    condition: 'Brand new',
    isFeatured: true,
    isOnDeal: true,
    dealDiscount: 11
  },
  {
    name: 'Apple MacBook Pro 16" Apple M3 Max Chip - 1TB SSD',
    price: 2499.00,
    originalPrice: 2899.00,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500&auto=format&fit=crop&q=60'
    ],
    description: 'The MacBook Pro 16-inch blasts forward with M3 Max, an incredibly advanced chip that brings massive performance and capabilities for the most extreme workflows.',
    shortDescription: '16.2" Liquid Retina XDR screen, 36GB Unified Memory, M3 Max 16-Core CPU.',
    category: 'Electronics',
    subcategory: 'Laptops',
    brand: 'Apple',
    stock: 15,
    rating: 4.9,
    reviewCount: 88,
    orderCount: 220,
    freeShipping: true,
    features: ['Metallic', '8GB Ram', 'Large Memory'],
    specs: {
      model: 'MacBook Pro 16 M3',
      style: 'Laptop',
      certificate: 'ENERGY STAR',
      size: '355.7 x 248.1 x 16.8 mm',
      memory: '36GB RAM / 1TB SSD'
    },
    tieredPricing: [
      { minQty: 1, maxQty: 3, price: 2499.00 },
      { minQty: 4, maxQty: 10, price: 2420.00 }
    ],
    supplier: { name: 'Apple Authorized Seller', country: 'United States', verified: true },
    condition: 'Brand new',
    isFeatured: true,
    isOnDeal: false
  },
  {
    name: 'Samsung Galaxy S24 Ultra - 5G 512GB Titanium Black',
    price: 1199.00,
    originalPrice: 1299.00,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format&fit=crop&q=60',
    description: 'Meet Galaxy S24 Ultra, the ultimate form of Galaxy Ultra with a new titanium exterior and a 6.8-inch flat display. S-Pen included. 200MP Main Camera with AI zoom.',
    category: 'Electronics',
    subcategory: 'Smartphones',
    brand: 'Samsung',
    stock: 35,
    rating: 4.7,
    reviewCount: 198,
    orderCount: 654,
    freeShipping: true,
    features: ['Metallic', 'Super power', 'Large Memory'],
    specs: {
      model: 'S24 Ultra',
      style: 'Smartphone',
      size: '162.3 x 79.0 x 8.6 mm',
      memory: '12GB RAM / 512GB ROM'
    },
    supplier: { name: 'Samsung Premium Store', country: 'South Korea', verified: true },
    condition: 'Brand new',
    isFeatured: true,
    isOnDeal: true,
    dealDiscount: 8
  },
  {
    name: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
    price: 348.00,
    originalPrice: 399.00,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
    description: 'Industry-leading noise canceling wireless overhead headphones with Auto NC Optimizer, crystal clear hands-free calling, and 30-hour battery life.',
    category: 'Electronics',
    subcategory: 'Headphones',
    brand: 'Sony',
    stock: 50,
    rating: 4.6,
    reviewCount: 432,
    orderCount: 1890,
    freeShipping: true,
    features: ['Plastic cover', 'Super power'],
    specs: {
      model: 'WH-1000XM5',
      style: 'Over-ear',
      size: '220 x 180 x 70 mm',
      memory: 'Bluetooth 5.2'
    },
    supplier: { name: 'Sony Direct Store', country: 'Japan', verified: true },
    condition: 'Brand new',
    isFeatured: true,
    isOnDeal: true,
    dealDiscount: 13
  },
  
  // Category: Clothing
  {
    name: "Mens Long Sleeve T-shirt Cotton Polo Shirt",
    price: 32.00,
    originalPrice: 45.00,
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500&auto=format&fit=crop&q=60'
    ],
    description: 'Comfortable cotton base layer slim muscle polo shirts. Designed with classic styling, button cuffs, and premium fabric blend suitable for summer and winter wear.',
    shortDescription: 'Classic knit polo shirt made from organic cotton fiber blends.',
    category: 'Clothing',
    subcategory: 'T-Shirts',
    brand: 'Zara',
    stock: 120,
    rating: 4.3,
    reviewCount: 32,
    orderCount: 154,
    freeShipping: false,
    features: ['Cotton blend', 'Breathable', 'Washable'],
    specs: {
      model: 'PL-8868',
      style: 'Classic Polo',
      certificate: 'Eco-Textile Cert',
      size: 'S, M, L, XL, XXL',
      memory: '100% Organic Cotton'
    },
    tieredPricing: [
      { minQty: 50, maxQty: 100, price: 98.00 }, // Matches Figma details tiered price mock values
      { minQty: 101, maxQty: 700, price: 90.00 },
      { minQty: 701, maxQty: 10000, price: 78.00 }
    ],
    supplier: { name: 'Guanjoi Trading LLC', country: 'Germany', verified: true },
    condition: 'Brand new',
    isFeatured: true,
    isOnDeal: false
  },
  {
    name: 'Classic Blue Denim Jeans Straight Fit',
    price: 49.00,
    originalPrice: 79.00,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format&fit=crop&q=60',
    description: 'Iconic straight-fit denim jeans with copper rivets and button fly closure. Made with 100% heavyweight cotton denim that breaks in beautifully over time.',
    category: 'Clothing',
    subcategory: 'Jeans',
    brand: "Levi's",
    stock: 90,
    rating: 4.4,
    reviewCount: 88,
    orderCount: 310,
    freeShipping: true,
    features: ['100% Cotton', 'Copper Rivets'],
    specs: {
      model: '501 Straight',
      style: 'Jeans',
      size: '30, 32, 34, 36'
    },
    supplier: { name: 'Denim Depot', country: 'United States', verified: false },
    condition: 'Brand new',
    isFeatured: false,
    isOnDeal: true,
    dealDiscount: 37
  },
  {
    name: 'Winter Puffer Jacket Waterproof Hooded',
    price: 180.00,
    originalPrice: 240.00,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60',
    description: 'Keep warm in extreme winter weather. Waterproof outer shell with 700-fill down insulation, adjustable toggle hood, and multiple secure zip pockets.',
    category: 'Clothing',
    subcategory: 'Jackets',
    brand: 'The North Face',
    stock: 40,
    rating: 4.7,
    reviewCount: 112,
    orderCount: 200,
    freeShipping: true,
    features: ['Waterproof', 'Thermal Insulation'],
    specs: {
      model: 'Nuptse Puffer',
      style: 'Heavy Coat',
      size: 'M, L, XL'
    },
    supplier: { name: 'Outdoors Supply', country: 'Canada', verified: true },
    condition: 'Brand new',
    isFeatured: true,
    isOnDeal: false
  },

  // Category: Home & Outdoor / Kitchen
  {
    name: 'IKEA Soft Leather Lounge Armchair',
    price: 299.00,
    originalPrice: 349.00,
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=500&auto=format&fit=crop&q=60',
    description: 'Elegant accent lounge chair upholstered in high-grade grain leather. Solid oak leg base offering sturdy construction and maximum comfort for living spaces.',
    category: 'Home & Kitchen',
    subcategory: 'Furniture',
    brand: 'IKEA',
    stock: 12,
    rating: 4.5,
    reviewCount: 45,
    orderCount: 95,
    freeShipping: false,
    specs: {
      model: 'Poang Leather',
      style: 'Armchair',
      size: '68 x 82 x 100 cm'
    },
    supplier: { name: 'Nordic Designs', country: 'Sweden', verified: true },
    condition: 'Brand new',
    isFeatured: true,
    isOnDeal: false
  },
  {
    name: 'KitchenAid Artisan Stand Mixer 5-Quart',
    price: 449.00,
    originalPrice: 499.00,
    image: 'https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=500&auto=format&fit=crop&q=60',
    description: 'Durable metal stand mixer with 10 speeds and a 5-quart polished stainless steel bowl. Includes dough hook, flat beater, and wire whip.',
    category: 'Home & Kitchen',
    subcategory: 'Cookware',
    brand: 'KitchenAid',
    stock: 18,
    rating: 4.8,
    reviewCount: 289,
    orderCount: 540,
    freeShipping: true,
    specs: {
      model: 'Artisan 5Qt',
      style: 'Stand Mixer',
      size: '35.6 x 22.2 x 36.2 cm'
    },
    supplier: { name: 'BakeCraft Imports', country: 'United States', verified: true },
    condition: 'Brand new',
    isFeatured: true,
    isOnDeal: false
  },
  {
    name: 'Dyson V15 Detect Cordless Vacuum Cleaner',
    price: 749.00,
    originalPrice: 799.00,
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500&auto=format&fit=crop&q=60',
    description: 'Dysons most powerful intelligent cordless vacuum. Features laser illumination that reveals invisible dust, with smart sensors modifying suction dynamically.',
    category: 'Home & Kitchen',
    subcategory: 'Appliances',
    brand: 'Dyson',
    stock: 14,
    rating: 4.7,
    reviewCount: 154,
    orderCount: 380,
    freeShipping: true,
    specs: {
      model: 'V15 Detect',
      style: 'Stick Vacuum',
      size: '126 x 25 x 26 cm'
    },
    supplier: { name: 'Dyson Premium Store', country: 'Great Britain', verified: true },
    condition: 'Brand new',
    isFeatured: true,
    isOnDeal: true,
    dealDiscount: 6
  }
];

// Dynamically generate another 40 products to reach 50+ products
const brands = {
  Electronics: ['Samsung', 'Apple', 'Huawei', 'Pocco', 'Lenovo', 'Sony', 'Canon', 'GoPro'],
  Clothing: ['Zara', 'H&M', 'Nike', 'Adidas', "Levi's", 'Uniqlo'],
  'Home & Kitchen': ['IKEA', 'KitchenAid', 'Dyson', 'Philips', 'Instant Pot']
};

const subcategories = {
  Electronics: ['Smartphones', 'Laptops', 'Headphones', 'Cameras', 'Smartwatches'],
  Clothing: ['T-Shirts', 'Jeans', 'Jackets', 'Socks'],
  'Home & Kitchen': ['Furniture', 'Cookware', 'Appliances']
};

const images = {
  Smartphones: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=60',
  Laptops: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=60',
  Headphones: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500&auto=format&fit=crop&q=60',
  Cameras: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=60',
  Smartwatches: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=500&auto=format&fit=crop&q=60',
  'T-Shirts': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=60',
  Jeans: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format&fit=crop&q=60',
  Jackets: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&auto=format&fit=crop&q=60',
  Socks: 'https://images.unsplash.com/photo-1582966772680-860e372bb558?w=500&auto=format&fit=crop&q=60',
  Furniture: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=500&auto=format&fit=crop&q=60',
  Cookware: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=500&auto=format&fit=crop&q=60',
  Appliances: 'https://images.unsplash.com/photo-1585338114002-96c5ac60f47e?w=500&auto=format&fit=crop&q=60'
};

const templates = [
  'Pro Edition Ultra',
  'V3 Series Slim',
  'Premium Home Accessory',
  'Modern Classic Comfort',
  'X-Series Advanced 5G',
  'Lightweight Sport',
  'High-Fidelity Stereo',
  'Smart Connected Touch'
];

for (let i = 1; i <= 42; i++) {
  const categories = Object.keys(brands);
  const category = categories[i % categories.length];
  const subcat = subcategories[category][i % subcategories[category].length];
  const brand = brands[category][i % brands[category].length];
  const template = templates[i % templates.length];
  
  const name = `${brand} ${template} ${subcat.slice(0, -1) || subcat} ${100 + i}`;
  const price = Math.round((25 + (i * 12.5)) * 100) / 100;
  const originalPrice = Math.round(price * 1.15 * 100) / 100;
  const img = images[subcat] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60';
  
  products.push({
    name,
    price,
    originalPrice,
    image: img,
    images: [img],
    description: `The brand new ${name} is engineered to deliver peak performance and reliability. It features outstanding craftsmanship, ergonomic build, and comes with a direct manufacturers warranty for absolute peace of mind.`,
    shortDescription: `Top quality ${subcat} manufactured by leading global developer ${brand}.`,
    category,
    subcategory: subcat,
    brand,
    stock: 10 + (i * 3),
    rating: Math.round((4.0 + (i % 10) * 0.1) * 10) / 10,
    reviewCount: 10 + i * 2,
    orderCount: 50 + i * 5,
    freeShipping: i % 2 === 0,
    features: [i % 2 === 0 ? 'Metallic' : 'Plastic cover', i % 3 === 0 ? 'Super power' : 'Large Memory'],
    specs: {
      model: `${brand}-${template.split(' ')[0]}-${100 + i}`,
      style: subcat,
      certificate: 'ISO-9001 CE',
      size: `${100 + i} x ${100 + i} x ${10 + i} mm`,
      memory: 'N/A'
    },
    tieredPricing: [
      { minQty: 1, maxQty: 10, price },
      { minQty: 11, maxQty: 50, price: Math.round(price * 0.95 * 100) / 100 },
      { minQty: 51, maxQty: 1000, price: Math.round(price * 0.90 * 100) / 100 }
    ],
    supplier: {
      name: `${brand} Official Distributor`,
      country: i % 3 === 0 ? 'Germany' : i % 3 === 1 ? 'United States' : 'China',
      verified: i % 2 === 0
    },
    condition: i % 5 === 0 ? 'Refurbished' : 'Brand new',
    isFeatured: i % 4 === 0,
    isOnDeal: i % 6 === 0,
    dealDiscount: i % 6 === 0 ? 15 : 0
  });
}

const seedData = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';
    console.log(`Connecting to database for seeding: ${connStr}`);
    await mongoose.connect(connStr);

    // Clear old datasets
    await User.deleteMany({});
    await Product.deleteMany({});
    await Cart.deleteMany({});

    console.log('Database cleared of existing Users, Products and Carts.');

    // Seed Admin User
    const adminUser = await User.create({
      name: 'Super Admin',
      email: 'admin@ecommerce.com',
      password: 'Admin@123456',
      role: 'admin',
    });

    console.log(`Admin User created: ${adminUser.email}`);

    // Create empty cart for Admin User
    await Cart.create({ user: adminUser._id, items: [] });

    // Seed Products
    products.forEach(p => {
      p.colors = p.colors || ['Black', 'Silver', 'White'];
      p.sizes = p.sizes || ['Standard'];
    });
    const createdProducts = await Product.insertMany(products);
    console.log(`Successfully seeded ${createdProducts.length} real products!`);

    mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
