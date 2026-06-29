const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Cleaning old entries...');
  await prisma.cart.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
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
            image: item.img
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
          { name: 'KIPSTA Raincoat Unisex Waterproof Hooded Football Warm-Up Moisture...', description: 'Limited stock', price: 1299, stock: 50, image: '/images/raincoat.png' },
          { name: 'KIPRUN Men\'s Running Shorts Run 500 - Smoked Green', description: 'Regular stock', price: 799, stock: 100, image: 'https://images.unsplash.com/photo-1512327428889-607eeb19efe8?q=80&w=400' },
          { name: 'OXELO Kids Skating Shoes Inline Play 3 Blue', description: 'For 4-8 Years old | Upto 60 Kgs', price: 1799, stock: 30, image: 'https://images.unsplash.com/photo-1564982752979-3f7bc974d29a?auto=format&fit=crop&w=400&q=80' },
          { name: 'DOMYOS Men Gym Trackpant Convertible, Jog Fit, Quick Dry, Zip...', description: 'Online exclusive', price: 999, stock: 200, image: '/images/trackpants_main.png' },
          { name: 'DECATHLON Non Polarized Cat sports sunglasses, Explore 500...', description: 'Regular stock', price: 1599, stock: 80, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=400' }
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
          { name: 'DOMYOS Men Gym Trackpant Convertible', description: 'Regular fit', price: 999, stock: 150, image: '/images/trackpants_main.png' },
          { name: 'DOMYOS Men Fitness Tracksuit Jacket', description: 'Warm and comfortable', price: 999, stock: 100, image: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=400' },
          { name: 'DOMYOS Men Gym Shorts, Stretchable', description: 'High performance', price: 399, stock: 200, image: 'https://images.unsplash.com/photo-1512327428889-607eeb19efe8?q=80&w=400' },
          { name: 'DOMYOS Men Gym Trackpants Slim Fit', description: 'Best seller', price: 899, stock: 120, image: '/images/trackpants_main.png' }
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
          { name: 'NABAIJI Microfibre Towel Basic Small Lightweight & Absorbent', description: 'Quick dry', price: 99, stock: 500, image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400' },
          { name: 'INESIS Golf Ball 100 White', description: 'For beginners', price: 49, stock: 1000, image: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=400' },
          { name: 'BTWIN Cycle Water Bottle 750ml - Yellow', description: 'BPA free', price: 99, stock: 300, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=400' }
        ]
      }
    }
  });

  console.log('✅ MySQL Database successfully seeded with accurate product images!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });