const prisma = require('../config/prisma');

class CategoryController {
  async getAll(req, res) {
    try {
      // Pull categories and include the child products data from your MySQL relations
      const categories = await prisma.category.findMany({
        include: {
          products: true
        }
      });
      return res.status(200).json(categories);
    } catch (error) {
      console.error("SQL Retrieval Error:", error);
      return res.status(500).json({ error: 'Failed to request catalog rows from MySQL database.' });
    }
  }
}

module.exports = new CategoryController();