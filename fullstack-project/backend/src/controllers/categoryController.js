const prisma = require('../config/prisma');

class CategoryController {
  async getAll(req, res) {
    try {
      const type = req.query.type;
      
      const filter = {};
      if (type === 'layout') {
        filter.isLayout = true;
      } else if (type === 'standard') {
        filter.isLayout = false;
      }
      
      const categories = await prisma.category.findMany({
        where: filter,
        include: {
          products: filter.isLayout === true ? true : {
            where: { isDummy: false }
          }
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