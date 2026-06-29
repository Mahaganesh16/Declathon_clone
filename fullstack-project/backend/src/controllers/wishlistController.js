const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const wishlistItems = await prisma.wishlist.findMany({
      where: { userId },
      include: { product: true }
    });

    const formattedWishlist = wishlistItems.map(item => ({
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      image: item.product.image
    }));

    res.json(formattedWishlist);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ message: 'Server error fetching wishlist' });
  }
};

exports.toggleWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'productId is required' });
    }

    const existingItem = await prisma.wishlist.findFirst({
      where: { userId, productId: parseInt(productId) }
    });

    if (existingItem) {
      // Remove from wishlist
      await prisma.wishlist.delete({ where: { id: existingItem.id } });
      res.json({ message: 'Item removed from wishlist', added: false });
    } else {
      // Add to wishlist
      await prisma.wishlist.create({
        data: {
          userId,
          productId: parseInt(productId)
        }
      });
      res.json({ message: 'Item added to wishlist', added: true });
    }
  } catch (error) {
    console.error('Error toggling wishlist item:', error);
    res.status(500).json({ message: 'Server error updating wishlist' });
  }
};
