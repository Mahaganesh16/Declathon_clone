const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Cleaning old entries...');
  await prisma.cart.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.wishlist.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});

  console.log('🌱 Storing exact image layouts into MySQL database...');

  // Exact dataset matched to image_bab647.png
  const catalogSetup = [
    { name: "Activewear", img: "https://images.unsplash.com/photo-1483721310020-03333e577078?q=80&w=500" },
    { name: "Fitness Equipments", img: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=500" },
    { name: "Cycling", img: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=500" },
    { name: "Hiking & Trekking", img: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=500" },
    { name: "Shoes", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500" },
    { name: "Bag & Backpacks", img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=500" },
    { name: "Sports Accessories", img: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=500" }
  ];

  for (const item of catalogSetup) {
    await prisma.category.create({
      data: {
        name: item.name,
        products: {
          create: {
            name: `${item.name} Official Asset`,
            description: "Production image asset managed via SQL database mapping",
            price: 1999.00,
            stock: 120,
            image: item.img,
            images: [item.img],
            colors: [item.img]
          }
        }
      }
    });
  }

  // Seed Trending Near You (Category 102)
  await prisma.category.create({
    data: {
      id: 102,
      name: "Trending Near You",
      products: {
        create: [
          { 
            name: 'KIPSTA Raincoat Unisex Waterproof Hooded Football Warm-Up Moisture...', 
            description: 'Limited stock', 
            price: 1299, 
            stock: 50, 
            image: '/images/raincoat.png',
            images: [
              '/images/raincoat.png',
              'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=400',
              'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?q=80&w=400'
            ],
            colors: [
              '/images/raincoat.png',
              'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=400'
            ]
          },
          { 
            name: 'KIPRUN Men\'s Running Shorts Run 500 - Smoked Green', 
            description: 'Regular stock', 
            price: 799, 
            stock: 100, 
            image: 'https://images.unsplash.com/photo-1512327428889-607eeb19efe8?q=80&w=400',
            images: [
              'https://images.unsplash.com/photo-1512327428889-607eeb19efe8?q=80&w=400',
              'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=400',
              'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=400'
            ],
            colors: [
              'https://images.unsplash.com/photo-1512327428889-607eeb19efe8?q=80&w=400',
              'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=400'
            ]
          },
          { 
            name: 'OXELO Kids Skating Shoes Inline Play 3 Blue', 
            description: 'For 4-8 Years old | Upto 60 Kgs', 
            price: 1799, 
            stock: 30, 
            image: 'https://images.unsplash.com/photo-1564982752979-3f7bc974d29a?auto=format&fit=crop&w=400&q=80',
            images: [
              'https://images.unsplash.com/photo-1564982752979-3f7bc974d29a?auto=format&fit=crop&w=400&q=80',
              'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400'
            ],
            colors: [
              'https://images.unsplash.com/photo-1564982752979-3f7bc974d29a?auto=format&fit=crop&w=400&q=80',
              'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400'
            ]
          },
          { 
            name: 'DOMYOS Men Gym Trackpant Convertible, Jog Fit, Quick Dry, Zip...', 
            description: 'Online exclusive', 
            price: 999, 
            stock: 200, 
            image: '/images/trackpants_main.png',
            images: [
              '/images/trackpants_main.png',
              '/images/trackpants_side.png',
              '/images/trackpants_back.png'
            ],
            colors: [
              '/images/trackpants_main.png',
              '/images/trackpants_side.png',
              '/images/trackpants_back.png',
              '/images/trackpants_main.png',
              '/images/trackpants_side.png',
              '/images/trackpants_back.png',
              '/images/trackpants_main.png',
              '/images/trackpants_side.png',
              '/images/trackpants_back.png'
            ]
          },
          { 
            name: 'DECATHLON Non Polarized Cat sports sunglasses, Explore 500...', 
            description: 'Regular stock', 
            price: 1599, 
            stock: 80, 
            image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=400',
            images: [
              'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=400',
              'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=400'
            ],
            colors: [
              'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=400',
              'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=400'
            ]
          }
        ]
      }
    }
  });

  // Seed Workout Checklist (Category 99)
  await prisma.category.create({
    data: {
      id: 99,
      name: "Workout Checklist",
      products: {
        create: [
          { 
            name: 'DOMYOS Men Gym Trackpant Convertible', 
            description: 'Regular fit', 
            price: 999, 
            stock: 150, 
            image: '/images/trackpants_main.png',
            images: [
              '/images/trackpants_main.png',
              '/images/trackpants_side.png',
              '/images/trackpants_back.png'
            ],
            colors: [
              '/images/trackpants_main.png',
              '/images/trackpants_side.png',
              '/images/trackpants_back.png',
              '/images/trackpants_main.png',
              '/images/trackpants_side.png',
              '/images/trackpants_back.png',
              '/images/trackpants_main.png',
              '/images/trackpants_side.png',
              '/images/trackpants_back.png'
            ]
          },
          { 
            name: 'DOMYOS Men Fitness Tracksuit Jacket', 
            description: 'Warm and comfortable', 
            price: 999, 
            stock: 100, 
            image: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=400',
            images: [
              'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=400',
              'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=400'
            ],
            colors: [
              'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=400',
              'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=400'
            ]
          },
          { 
            name: 'DOMYOS Men Gym Shorts, Stretchable', 
            description: 'High performance', 
            price: 399, 
            stock: 200, 
            image: 'https://images.unsplash.com/photo-1512327428889-607eeb19efe8?q=80&w=400',
            images: [
              'https://images.unsplash.com/photo-1512327428889-607eeb19efe8?q=80&w=400',
              'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=400'
            ],
            colors: [
              'https://images.unsplash.com/photo-1512327428889-607eeb19efe8?q=80&w=400',
              'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=400'
            ]
          },
          { 
            name: 'DOMYOS Men Gym Trackpants Slim Fit', 
            description: 'Best seller', 
            price: 899, 
            stock: 120, 
            image: '/images/trackpants_main.png',
            images: [
              '/images/trackpants_main.png',
              '/images/trackpants_side.png',
              '/images/trackpants_back.png'
            ],
            colors: [
              '/images/trackpants_main.png',
              '/images/trackpants_side.png',
              '/images/trackpants_back.png',
              '/images/trackpants_main.png',
              '/images/trackpants_side.png',
              '/images/trackpants_back.png',
              '/images/trackpants_main.png',
              '/images/trackpants_side.png',
              '/images/trackpants_back.png'
            ]
          }
        ]
      }
    }
  });

  // Seed Under 499 Products (Category 104)
  await prisma.category.create({
    data: {
      id: 104,
      name: "Value Deals",
      products: {
        create: [
          { 
            name: 'NABAIJI Microfibre Towel Basic Small Lightweight & Absorbent', 
            description: 'Quick dry', 
            price: 99, 
            stock: 500, 
            image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400',
            images: ['https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400'],
            colors: ['https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400']
          },
          { 
            name: 'INESIS Golf Ball 100 White', 
            description: 'For beginners', 
            price: 49, 
            stock: 1000, 
            image: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=400',
            images: ['https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=400'],
            colors: ['https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=400']
          },
          { 
            name: 'BTWIN Cycle Water Bottle 750ml - Yellow', 
            description: 'BPA free', 
            price: 99, 
            stock: 300, 
            image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=400',
            images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=400'],
            colors: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=400']
          }
        ]
      }
    }
  });

  // Seed Hero Slider (Category 100)
  await prisma.category.create({
    data: {
      id: 100,
      name: "Hero Slider",
      products: {
        create: [
          { name: 'Find Your Racket', description: 'Elevate Your Game.', price: 299, stock: 10, image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1400&q=80', images: ['https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1400&q=80'], colors: ['https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1400&q=80'] },
          { name: 'Football Collections', description: 'Gear Up For The Pitch.', price: 499, stock: 10, image: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&w=1400&q=80', images: ['https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&w=1400&q=80'], colors: ['https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&w=1400&q=80'] },
          { name: 'Running Gear', description: 'Push Your Limits.', price: 399, stock: 10, image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1400&q=80', images: ['https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1400&q=80'], colors: ['https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1400&q=80'] }
        ]
      }
    }
  });

  // Seed After Sales Services (Category 101)
  await prisma.category.create({
    data: {
      id: 101,
      name: "After Sales Services",
      products: {
        create: [
          { name: 'Cycle Servicing', description: 'BOOK NOW', price: 0, stock: 10, image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=400&q=80', images: ['https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=400&q=80'], colors: ['https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=400&q=80'] },
          { name: 'Racket Stringing', description: 'BOOK NOW', price: 0, stock: 10, image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=400&q=80', images: ['https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=400&q=80'], colors: ['https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=400&q=80'] },
          { name: 'Buy back', description: 'Get a quote today', price: 0, stock: 10, image: 'https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?auto=format&fit=crop&w=400&q=80', images: ['https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?auto=format&fit=crop&w=400&q=80'], colors: ['https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?auto=format&fit=crop&w=400&q=80'] },
          { name: 'Assisted Shopping', description: 'BOOK NOW', price: 0, stock: 10, image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=400&q=80', images: ['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=400&q=80'], colors: ['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=400&q=80'] }
        ]
      }
    }
  });

  // Seed Price Budgets (Category 103)
  await prisma.category.create({
    data: {
      id: 103,
      name: "Price Budgets",
      products: {
        create: [
          { name: 'UNDER', description: '₹499', price: 499, stock: 10, image: '', images: [], colors: [] },
          { name: 'UNDER', description: '₹999', price: 999, stock: 10, image: '', images: [], colors: [] },
          { name: 'UNDER', description: '₹1499', price: 1499, stock: 10, image: '', images: [], colors: [] },
          { name: 'UNDER', description: '₹1999', price: 1999, stock: 10, image: '', images: [], colors: [] }
        ]
      }
    }
  });

  console.log('✅ MySQL Database successfully seeded with accurate product images!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });