const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getProducts = async (req, res) => {
  try {
    const { maxPrice } = req.query;
    
    let whereClause = {};
    if (maxPrice) {
      whereClause.price = {
        lte: parseFloat(maxPrice)
      };
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: true
      }
    });
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};
