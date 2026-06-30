import { useLanguage } from '../context/LanguageContext';

/**
 * Returns a localized version of a product's fields.
 * When the language is not English, it returns translated content
 * using our static translation map, falling back to original text.
 */

// Static product field translations for known categories/values
const PRODUCT_FIELD_TRANSLATIONS = {
  ar: {
    // Categories
    'Electronics': 'إلكترونيات',
    'Smartphones': 'هواتف ذكية',
    'Clothing': 'ملابس',
    'Home & Kitchen': 'المنزل والمطبخ',
    'Sports': 'رياضة',
    'Books': 'كتب',
    'Automobiles': 'سيارات',
    'Computers': 'حاسوب',
    'Beauty': 'جمال',
    'Toys': 'ألعاب',
    'Tools': 'أدوات',
    // Conditions
    'new': 'جديد',
    'used': 'مستعمل',
    'refurbished': 'مُجدَّد',
    // Status
    'In Stock': 'متوفر',
    'Out of Stock': 'غير متوفر',
    'Free Shipping': 'شحن مجاني',
    'Add to Cart': 'أضف إلى السلة',
    'Buy Now': 'اشتري الآن',
    'View Details': 'عرض التفاصيل',
  },
  fr: {
    'Electronics': 'Électronique',
    'Smartphones': 'Smartphones',
    'Clothing': 'Vêtements',
    'Home & Kitchen': 'Maison & Cuisine',
    'Sports': 'Sports',
    'Books': 'Livres',
    'Automobiles': 'Automobiles',
    'Computers': 'Informatique',
    'Beauty': 'Beauté',
    'Toys': 'Jouets',
    'Tools': 'Outils',
    'new': 'Nouveau',
    'used': 'Occasion',
    'refurbished': 'Reconditionné',
    'In Stock': 'En Stock',
    'Out of Stock': 'Rupture de Stock',
    'Free Shipping': 'Livraison Gratuite',
    'Add to Cart': 'Ajouter au Panier',
    'Buy Now': 'Acheter Maintenant',
    'View Details': 'Voir Détails',
  },
  de: {
    'Electronics': 'Elektronik',
    'Smartphones': 'Smartphones',
    'Clothing': 'Kleidung',
    'Home & Kitchen': 'Haus & Küche',
    'Sports': 'Sport',
    'Books': 'Bücher',
    'Automobiles': 'Automobile',
    'Computers': 'Computer',
    'Beauty': 'Schönheit',
    'Toys': 'Spielzeug',
    'Tools': 'Werkzeuge',
    'new': 'Neu',
    'used': 'Gebraucht',
    'refurbished': 'Generalüberholt',
    'In Stock': 'Auf Lager',
    'Out of Stock': 'Ausverkauft',
    'Free Shipping': 'Kostenloser Versand',
    'Add to Cart': 'In den Warenkorb',
    'Buy Now': 'Jetzt Kaufen',
    'View Details': 'Details Anzeigen',
  },
};

/**
 * Helper: Translates dynamic/seeded product name and description
 */
const translateDynamicProduct = (product, language) => {
  if (!product) return product;
  if (language === 'en') return product;

  let name = product.name;
  let description = product.description;
  let shortDescription = product.shortDescription;

  const brands = {
    ar: {
      'Samsung': 'سامسونج', 'Apple': 'آبل', 'Huawei': 'هواوي', 'Pocco': 'بوكو',
      'Lenovo': 'لينوفو', 'Sony': 'سوني', 'Canon': 'كانون', 'GoPro': 'جوبرو',
      'Zara': 'زارا', 'H&M': 'إتش آند إم', 'Nike': 'نايكي', 'Adidas': 'أديداس',
      "Levi's": 'ليفايس', 'Uniqlo': 'يونيكلو', 'IKEA': 'ايكيا', 'KitchenAid': 'كيتشن إيد',
      'Dyson': 'دايسون', 'Philips': 'فيليبس', 'Instant Pot': 'إنستانت بوت'
    },
    fr: {
      'Samsung': 'Samsung', 'Apple': 'Apple', 'Huawei': 'Huawei', 'Pocco': 'Pocco',
      'Lenovo': 'Lenovo', 'Sony': 'Sony', 'Canon': 'Canon', 'GoPro': 'GoPro',
      'Zara': 'Zara', 'H&M': 'H&M', 'Nike': 'Nike', 'Adidas': 'Adidas',
      "Levi's": "Levi's", 'Uniqlo': 'Uniqlo', 'IKEA': 'IKEA', 'KitchenAid': 'KitchenAid',
      'Dyson': 'Dyson', 'Philips': 'Philips', 'Instant Pot': 'Instant Pot'
    },
    de: {
      'Samsung': 'Samsung', 'Apple': 'Apple', 'Huawei': 'Huawei', 'Pocco': 'Pocco',
      'Lenovo': 'Lenovo', 'Sony': 'Sony', 'Canon': 'Canon', 'GoPro': 'GoPro',
      'Zara': 'Zara', 'H&M': 'H&M', 'Nike': 'Nike', 'Adidas': 'Adidas',
      "Levi's": "Levi's", 'Uniqlo': 'Uniqlo', 'IKEA': 'IKEA', 'KitchenAid': 'KitchenAid',
      'Dyson': 'Dyson', 'Philips': 'Philips', 'Instant Pot': 'Instant Pot'
    }
  };

  const templates = {
    ar: {
      'Pro Edition Ultra': 'الإصدار الاحترافي ألترا',
      'V3 Series Slim': 'سلسلة V3 نحيف',
      'Premium Home Accessory': 'إكسسوار منزلي ممتاز',
      'Modern Classic Comfort': 'راحة كلاسيكية حديثة',
      'X-Series Advanced 5G': 'سلسلة X متطورة 5G',
      'Lightweight Sport': 'رياضي خفيف الوزن',
      'High-Fidelity Stereo': 'ستيريو عالي الدقة',
      'Smart Connected Touch': 'لمس ذكي متصل'
    },
    fr: {
      'Pro Edition Ultra': 'Édition Pro Ultra',
      'V3 Series Slim': 'Série V3 Slim',
      'Premium Home Accessory': 'Accessoire de Maison Premium',
      'Modern Classic Comfort': 'Confort Classique Moderne',
      'X-Series Advanced 5G': 'Série X Avancée 5G',
      'Lightweight Sport': 'Sport Léger',
      'High-Fidelity Stereo': 'Stéréo Haute Fidélité',
      'Smart Connected Touch': 'Tactile Connecté Intelligent'
    },
    de: {
      'Pro Edition Ultra': 'Pro Edition Ultra',
      'V3 Series Slim': 'V3 Serie Schlank',
      'Premium Home Accessory': 'Premium Haus-Accessoire',
      'Modern Classic Comfort': 'Moderner Klassischer Komfort',
      'X-Series Advanced 5G': 'X-Serie Erweitert 5G',
      'Lightweight Sport': 'Leichtgewicht Sport',
      'High-Fidelity Stereo': 'High-Fidelity Stereo',
      'Smart Connected Touch': 'Smart Connected Touch'
    }
  };

  const subcategories = {
    ar: {
      'Smartphone': 'هاتف ذكي', 'Smartphones': 'هواتف ذكية',
      'Laptop': 'حاسوب محمول', 'Laptops': 'حواسيب محمولة',
      'Headphone': 'سماعة أذن', 'Headphones': 'سماعات أذن',
      'Camera': 'كاميرا', 'Cameras': 'كاميرات',
      'Smartwatch': 'ساعة ذكية', 'Smartwatches': 'ساعات ذكية',
      'T-Shirt': 'تي شيرت', 'T-Shirts': 'تي شيرتات',
      'Jean': 'بنطلون جينز', 'Jeans': 'بنطلونات جينز',
      'Jacket': 'سترة', 'Jackets': 'سترات',
      'Sock': 'جوارب', 'Socks': 'جوارب',
      'Furniture': 'أثاث',
      'Cookware': 'أدوات طبخ',
      'Appliance': 'جهاز منزلي', 'Appliances': 'أجهزة منزلية'
    },
    fr: {
      'Smartphone': 'Smartphone', 'Smartphones': 'Smartphones',
      'Laptop': 'Ordinateur portable', 'Laptops': 'Ordinateurs portables',
      'Headphone': 'Écouteur', 'Headphones': 'Écouteurs',
      'Camera': 'Appareil photo', 'Cameras': 'Appareils photo',
      'Smartwatch': 'Montre connectée', 'Smartwatches': 'Montres connectées',
      'T-Shirt': 'T-shirt', 'T-Shirts': 'T-shirts',
      'Jean': 'Jean', 'Jeans': 'Jeans',
      'Jacket': 'Veste', 'Jackets': 'Vestes',
      'Sock': 'Chaussette', 'Socks': 'Chaussettes',
      'Furniture': 'Mobilier',
      'Cookware': 'Ustensiles de cuisine',
      'Appliance': 'Appareil électroménager', 'Appliances': 'Appareils électroménagers'
    },
    de: {
      'Smartphone': 'Smartphone', 'Smartphones': 'Smartphones',
      'Laptop': 'Laptop', 'Laptops': 'Laptops',
      'Headphone': 'Kopfhörer', 'Headphones': 'Kopfhörer',
      'Camera': 'Kamera', 'Cameras': 'Kameras',
      'Smartwatch': 'Smartwatch', 'Smartwatches': 'Smartwatches',
      'T-Shirt': 'T-Shirt', 'T-Shirts': 'T-Shirts',
      'Jean': 'Jeans', 'Jeans': 'Jeans',
      'Jacket': 'Jacke', 'Jackets': 'Jacken',
      'Sock': 'Socke', 'Socks': 'Socken',
      'Furniture': 'Möbel',
      'Cookware': 'Kochgeschirr',
      'Appliance': 'Haushaltsgerät', 'Appliances': 'Haushaltsgeräte'
    }
  };

  const seedNames = {
    ar: {
      'Canon Camera EOS 2000D, Black 18-55mm Lens Kit': 'كاميرا كانون EOS 2000D، مجموعة عدسات سوداء 18-55 مم',
      'GoPro HERO12 Black Action Camera - Waterproof 4K': 'كاميرا جوبرو هيرو 12 سوداء - مقاومة للماء بدقة 4K',
      'Apple MacBook Pro 16" Apple M3 Max Chip - 1TB SSD': 'جهاز آبل ماك بوك برو 16 بوصة مع شريحة M3 ماكس - 1 تيرابايت SSD',
      'Samsung Galaxy S24 Ultra - 5G 512GB Titanium Black': 'سامسونج جالاكسي S24 الترا - الجيل الخامس 512 جيجا أسود تيتانيوم',
      'Sony WH-1000XM5 Wireless Noise Canceling Headphones': 'سماعات سوني WH-1000XM5 اللاسلكية العازلة للضوضاء',
      'Mens Long Sleeve T-shirt Cotton Polo Shirt': 'قميص بولو قطني بأكمام طويلة للرجال',
      'Classic Blue Denim Jeans Straight Fit': 'بنطلون جينز كلاسيكي أزرق قصة مستقيمة',
      'Winter Puffer Jacket Waterproof Hooded': 'سترة شتوية منفوخة مقاومة للماء مع غطاء للرأس',
      'IKEA Soft Leather Lounge Armchair': 'كرسي ذراعين جلدي مريح من ايكيا',
      'KitchenAid Artisan Stand Mixer 5-Quart': 'خلاط كيتشن إيد آرتيزان 5 لتر',
      'Dyson V15 Detect Cordless Vacuum Cleaner': 'مكنسة دايسون V15 اللاسلكية الذكية'
    },
    fr: {
      'Canon Camera EOS 2000D, Black 18-55mm Lens Kit': 'Appareil Photo Canon EOS 2000D, Kit Objectif Noir 18-55mm',
      'GoPro HERO12 Black Action Camera - Waterproof 4K': 'Caméra d\'action GoPro HERO12 Black - Étanche 4K',
      'Apple MacBook Pro 16" Apple M3 Max Chip - 1TB SSD': 'Apple MacBook Pro 16" Puce M3 Max - 1 To SSD',
      'Samsung Galaxy S24 Ultra - 5G 512GB Titanium Black': 'Samsung Galaxy S24 Ultra - 5G 512 Go Noir Titane',
      'Sony WH-1000XM5 Wireless Noise Canceling Headphones': 'Casque sans fil à réduction de bruit Sony WH-1000XM5',
      'Mens Long Sleeve T-shirt Cotton Polo Shirt': 'Polo en coton à manches longues pour hommes',
      'Classic Blue Denim Jeans Straight Fit': 'Jean denim bleu classique coupe droite',
      'Winter Puffer Jacket Waterproof Hooded': 'Doudoune d\'hiver imperméable à capuche',
      'IKEA Soft Leather Lounge Armchair': 'Fauteuil de salon en cuir souple IKEA',
      'KitchenAid Artisan Stand Mixer 5-Quart': 'Batteur sur socle KitchenAid Artisan 4,8 L',
      'Dyson V15 Detect Cordless Vacuum Cleaner': 'Aspirateur sans fil Dyson V15 Detect'
    },
    de: {
      'Canon Camera EOS 2000D, Black 18-55mm Lens Kit': 'Canon Kamera EOS 2000D, Schwarzes 18-55-mm-Objektiv-Kit',
      'GoPro HERO12 Black Action Camera - Waterproof 4K': 'GoPro HERO12 Black Action-Kamera - Wasserdicht 4K',
      'Apple MacBook Pro 16" Apple M3 Max Chip - 1TB SSD': 'Apple MacBook Pro 16" M3 Max Chip - 1TB SSD',
      'Samsung Galaxy S24 Ultra - 5G 512GB Titanium Black': 'Samsung Galaxy S24 Ultra - 5G 512GB Titan-Schwarz',
      'Sony WH-1000XM5 Wireless Noise Canceling Headphones': 'Sony WH-1000XM5 Kabellose Kopfhörer mit Geräuschunterdrückung',
      'Mens Long Sleeve T-shirt Cotton Polo Shirt': 'Herren Langarm T-Shirt Baumwoll-Polohemd',
      'Classic Blue Denim Jeans Straight Fit': 'Klassische blaue Denim-Jeans Regular Fit',
      'Winter Puffer Jacket Waterproof Hooded': 'Wasserdichte Winter-Steppjacke mit Kapuze',
      'IKEA Soft Leather Lounge Armchair': 'IKEA Weicher Leder-Lounge-Sessel',
      'KitchenAid Artisan Stand Mixer 5-Quart': 'KitchenAid Artisan Küchenmaschine 4,8 L',
      'Dyson V15 Detect Cordless Vacuum Cleaner': 'Dyson V15 Detect Kabelloser Staubsauger'
    }
  };

  const seedDescriptions = {
    ar: {
      'Capture beautiful detailed photos and cinematic Full HD movies with ease. 24.1 Megapixel sensor, Wi-Fi connectivity, and built-in Guide Mode make this the perfect starting camera for beginners.': 'التقط صوراً مفصلة جميلة وأفلاماً سينمائية عالية الدقة بالكامل بسهولة. مستشعر بدقة 24.1 ميجابكسل، اتصال Wi-Fi، ووضع الدليل المدمج يجعل هذه الكاميرا البدء المثالية للمبتدئين.',
      'GoPro HERO12 features custom HDR video recording, HyperSmooth 6.0 video stabilization, and a wider lens angle. Designed for adventure sports and travel content creation.': 'يتميز جوبرو هيرو 12 بتسجيل فيديو HDR مخصص، وتثبيت الفيديو HyperSmooth 6.0، وزاوية عدسة أوسع. مصمم للرياضات المغامرة وإنشاء محتوى السفر.',
      'The MacBook Pro 16-inch blasts forward with M3 Max, an incredibly advanced chip that brings massive performance and capabilities for the most extreme workflows.': 'ينطلق ماك بوك برو مقاس 16 بوصة إلى الأمام مع M3 ماكس، وهي شريحة متقدمة بشكل لا يصدق توفر أداءً هائلاً وقدرات لسير العمل الأكثر تطلبًا.',
      'Meet Galaxy S24 Ultra, the ultimate form of Galaxy Ultra with a new titanium exterior and a 6.8-inch flat display. S-Pen included. 200MP Main Camera with AI zoom.': 'تعرف على جالاكسي S24 الترا، الشكل النهائي لجالاكسي الترا مع هيكل خارجي جديد من التيتانيوم وشاشة مسطحة مقاس 6.8 بوصة. قلم S-Pen متضمن. كاميرا رئيسية بدقة 200 ميجابكسل مع زوم بالذكاء الاصطناعي.',
      'Industry-leading noise canceling wireless overhead headphones with Auto NC Optimizer, crystal clear hands-free calling, and 30-hour battery life.': 'سماعات رأس لاسلكية فوق الأذن رائدة في الصناعة لإلغاء الضوضاء مع مُحسِّن NC التلقائي ومكالمات واضحة تمامًا وعمر بطارية يصل إلى 30 ساعة.',
      'Comfortable cotton base layer slim muscle polo shirts. Designed with classic styling, button cuffs, and premium fabric blend suitable for summer and winter wear.': 'قمصان بولو مريحة مصنوعة من القطن كطبقة أساسية ملائمة للعضلات. مصممة بتصميم كلاسيكي وأساور بأزرار ومزيج أقمشة ممتاز مناسب للارتداء الصيفي والشتوي.',
      'Iconic straight-fit denim jeans with copper rivets and button fly closure. Made with 100% heavyweight cotton denim that breaks in beautifully over time.': 'بنطال جينز كلاسيكي بقصة مستقيمة مع مسامير نحاسية وسحاب زر. مصنوع من القطن الثقيل 100% الذي يصبح أكثر راحة بمرور الوقت.',
      'Keep warm in extreme winter weather. Waterproof outer shell with 700-fill down insulation, adjustable toggle hood, and multiple secure zip pockets.': 'حافظ على الدفء في طقس الشتاء القارس. غطاء خارجي مقاوم للماء مع عزل ريش بقوة 700، وغطاء رأس قابل للتعديل وجيوب متعددة آمنة بسحاب.',
      'Dysons most powerful intelligent cordless vacuum. Features laser illumination that reveals invisible dust, with smart sensors modifying suction dynamically.': 'مكنسة دايسون اللاسلكية الذكية الأكثر قوة. تتميز بإضاءة ليزر تكشف الغبار غير المرئي، مع مستشعرات ذكية تعدل قوة الشفط ديناميكيًا.'
    },
    fr: {
      'Capture beautiful detailed photos and cinematic Full HD movies with ease. 24.1 Megapixel sensor, Wi-Fi connectivity, and built-in Guide Mode make this the perfect starting camera for beginners.': 'Capturez de belles photos détaillées et des films cinématographiques Full HD en toute simplicité. Capteur 24,1 mégapixels, Wi-Fi et mode guide intégré.',
      'GoPro HERO12 features custom HDR video recording, HyperSmooth 6.0 video stabilization, and a wider lens angle. Designed for adventure sports and travel content creation.': 'GoPro HERO12 offre un enregistrement vidéo HDR personnalisé, une stabilisation vidéo HyperSmooth 6.0 et un angle d\'objectif plus large.',
      'The MacBook Pro 16-inch blasts forward with M3 Max, an incredibly advanced chip that brings massive performance and capabilities for the most extreme workflows.': 'Le MacBook Pro 16 pouces va encore plus loin avec la M3 Max, une puce incroyablement avancée pour les flux de travail les plus extrêmes.',
      'Meet Galaxy S24 Ultra, the ultimate form of Galaxy Ultra with a new titanium exterior and a 6.8-inch flat display. S-Pen included. 200MP Main Camera with AI zoom.': 'Découvrez le Galaxy S24 Ultra, la forme ultime de Galaxy Ultra avec un nouveau boîtier en titane et un écran plat de 6,8 pouces.',
      'Industry-leading noise canceling wireless overhead headphones with Auto NC Optimizer, crystal clear hands-free calling, and 30-hour battery life.': 'Casque sans fil à réduction de bruit de pointe avec optimiseur NC automatique, appels mains libres clairs et 30 heures d\'autonomie.',
      'Comfortable cotton base layer slim muscle polo shirts. Designed with classic styling, button cuffs, and premium fabric blend suitable for summer and winter wear.': 'Polo ajusté confortable en coton. Design classique, poignets boutonnés et mélange de tissus de qualité supérieure.',
      'Iconic straight-fit denim jeans with copper rivets and button fly closure. Made with 100% heavyweight cotton denim that breaks in beautifully over time.': 'Jean denim coupe droite emblématique avec rivets en cuivre. Fait à 100% de coton épais.',
      'Keep warm in extreme winter weather. Waterproof outer shell with 700-fill down insulation, adjustable toggle hood, and multiple secure zip pockets.': 'Restez au chaud en hiver. Extérieur imperméable avec isolation en duvet 700, capuche réglable et poches zippées sécurisées.',
      'Dysons most powerful intelligent cordless vacuum. Features laser illumination that reveals invisible dust, with smart sensors modifying suction dynamically.': 'L\'aspirateur sans fil intelligent le plus puissant de Dyson. Éclairage laser pour la poussière invisible et capteurs intelligents.'
    },
    de: {
      'Capture beautiful detailed photos and cinematic Full HD movies with ease. 24.1 Megapixel sensor, Wi-Fi connectivity, and built-in Guide Mode make this the perfect starting camera for beginners.': 'Nehmen Sie mühelos wunderschöne, detaillierte Fotos und kinoreife Full-HD-Filme auf. 24,1-Megapixel-Sensor, WLAN-Konnektivität.',
      'GoPro HERO12 features custom HDR video recording, HyperSmooth 6.0 video stabilization, and a wider lens angle. Designed for adventure sports and travel content creation.': 'GoPro HERO12 bietet benutzerdefinierte HDR-Videoaufnahmen, HyperSmooth 6.0-Videostabilisierung und einen größeren Objektivwinkel.',
      'The MacBook Pro 16-inch blasts forward with M3 Max, an incredibly advanced chip that brings massive performance and capabilities for the most extreme workflows.': 'Das 16-Zoll MacBook Pro macht mit dem M3 Max einen gewaltigen Sprung nach vorn – einem unglaublich fortschrittlichen Chip für extreme Workflows.',
      'Meet Galaxy S24 Ultra, the ultimate form of Galaxy Ultra with a new titanium exterior and a 6.8-inch flat display. S-Pen included. 200MP Main Camera with AI zoom.': 'Lernen Sie das Galaxy S24 Ultra kennen – die ultimative Form des Galaxy Ultra mit neuem Titangehäuse und flachem 6,8-Zoll-Display.',
      'Industry-leading noise canceling wireless overhead headphones with Auto NC Optimizer, crystal clear hands-free calling, and 30-hour battery life.': 'Branchenführender kabelloser Over-Ear-Kopfhörer mit Geräuschunterdrückung, automatischem NC-Optimierer und 30 Stunden Akkulaufzeit.',
      'Comfortable cotton base layer slim muscle polo shirts. Designed with classic styling, button cuffs, and premium fabric blend suitable for summer and winter wear.': 'Bequemes Polohemd aus Baumwollmischung. Klassisches Design, geknöpfte Manschetten und hochwertiger Stoff.',
      'Iconic straight-fit denim jeans with copper rivets and button fly closure. Made with 100% heavyweight cotton denim that breaks in beautifully over time.': 'Klassische Denim-Jeans im Straight-Fit mit Kupfernieten. Hergestellt aus 100% schwerem Baumwolldenim.',
      'Keep warm in extreme winter weather. Waterproof outer shell with 700-fill down insulation, adjustable toggle hood, and multiple secure zip pockets.': 'Halten Sie sich bei extremem Winterwetter warm. Wasserdichte Außenschale mit Daunenisolierung.',
      'Dysons most powerful intelligent cordless vacuum. Features laser illumination that reveals invisible dust, with smart sensors modifying suction dynamically.': 'Dysons leistungsstärkster kabelloser Staubsauger. Mit Laserbeleuchtung und intelligenten Sensoren.'
    }
  };

  const dictNames = seedNames[language] || {};
  const dictDescs = seedDescriptions[language] || {};

  if (dictNames[name]) {
    name = dictNames[name];
  } else {
    // Dynamic generation translation
    // e.g. "Samsung Pro Edition Ultra Smartphone 101"
    const brandDict = brands[language] || {};
    const tempDict = templates[language] || {};
    const subcatDict = subcategories[language] || {};

    Object.entries(brandDict).forEach(([enWord, localWord]) => {
      const regex = new RegExp(`\\b${enWord}\\b`, 'g');
      name = name.replace(regex, localWord);
    });

    Object.entries(tempDict).forEach(([enWord, localWord]) => {
      name = name.replace(enWord, localWord);
    });

    Object.entries(subcatDict).forEach(([enWord, localWord]) => {
      name = name.replace(enWord, localWord);
      if (enWord.endsWith('s')) {
        name = name.replace(enWord.slice(0, -1), localWord);
      }
    });
  }

  if (dictDescs[description]) {
    description = dictDescs[description];
  } else if (description) {
    if (description.includes('is engineered to deliver peak performance and reliability')) {
      if (language === 'ar') {
        description = `تم تصميم ${name} الجديد تمامًا لتقديم ذروة الأداء والموثوقية. يتميز بحرفية متميزة وبنية مريحة ويأتي مع ضمان مباشر من الشركة المصنعة لراحة البال المطلقة.`;
      } else if (language === 'fr') {
        description = `Le tout nouveau ${name} est conçu pour offrir des performances et une fiabilité optimales. Il présente un savoir-faire exceptionnel, une construction ergonomique et est livré avec une garantie directe du fabricant pour une tranquillité d'esprit absolue.`;
      } else if (language === 'de') {
        description = `Das brandneue ${name} wurde entwickelt, um Spitzenleistung und Zuverlässigkeit zu bieten. Es zeichnet sich durch hervorragende Verarbeitung und ergonomisches Design aus und wird mit einer direkten Herstellergarantie geliefert.`;
      }
    }
  }

  if (shortDescription && shortDescription.includes('manufactured by leading global developer')) {
    const brandDict = brands[language] || {};
    const subcatDict = subcategories[language] || {};
    let subStr = product.subcategory;
    let brandStr = product.brand;
    if (subcatDict[subStr]) subStr = subcatDict[subStr];
    if (brandDict[brandStr]) brandStr = brandDict[brandStr];

    if (language === 'ar') {
      shortDescription = `${subStr} عالي الجودة تم تصنيعه بواسطة المطور العالمي الرائد ${brandStr}.`;
    } else if (language === 'fr') {
      shortDescription = `${subStr} de qualité supérieure fabriqué par le leader mondial ${brandStr}.`;
    } else if (language === 'de') {
      shortDescription = `Erstklassige ${subStr}, hergestellt vom weltweit führenden Entwickler ${brandStr}.`;
    }
  }

  return {
    ...product,
    name,
    description,
    shortDescription: shortDescription || product.shortDescription,
  };
};

/**
 * Hook: useLocalizedProduct
 * Returns a function that localizes a product object's fields.
 */
export const useLocalizedProduct = () => {
  const { language } = useLanguage();

  const localizeProduct = (product) => {
    if (!product) return product;
    
    // First translate category and condition
    const dict = PRODUCT_FIELD_TRANSLATIONS[language] || {};
    const baseProduct = {
      ...product,
      category: dict[product.category] || product.category,
      condition: dict[product.condition] || product.condition,
    };

    // Now dynamically translate name, description, shortDescription
    return translateDynamicProduct(baseProduct, language);
  };

  const localizeField = (value) => {
    if (language === 'en' || !value) return value;
    const dict = PRODUCT_FIELD_TRANSLATIONS[language] || {};
    return dict[value] || value;
  };

  return { localizeProduct, localizeField, language };
};

/**
 * Hook: usePageTranslations
 * Returns translations for common page labels.
 */
export const usePageTranslations = () => {
  const { t, language } = useLanguage();

  return {
    t,
    language,
    inStock: t('product.inStock'),
    outOfStock: t('product.outOfStock'),
    addToCart: t('product.addToCart'),
    buyNow: t('product.buyNow'),
    addToWishlist: t('product.addToWishlist'),
    viewAll: t('home.viewAll'),
    shopNow: t('home.shopNow'),
    loading: t('common.loading'),
    noResults: t('common.noResults'),
    search: t('common.search'),
    filter: t('common.filter'),
    sort: t('common.sort'),
  };
};
