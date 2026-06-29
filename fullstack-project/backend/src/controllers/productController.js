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

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: { category: true }
    });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};
