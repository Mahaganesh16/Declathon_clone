const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItems = await prisma.cart.findMany({
      where: { userId },
      include: { product: true }
    });

    // Map to frontend expected format
    const formattedCart = cartItems.map(item => ({
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      image: item.product.image,
      quantity: item.quantity
    }));

    res.json(formattedCart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Server error fetching cart' });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'productId is required' });
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cart.findFirst({
      where: { userId, productId: parseInt(productId) }
    });

    let result;
    if (existingItem) {
      result = await prisma.cart.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + (quantity || 1) }
      });
    } else {
      result = await prisma.cart.create({
        data: {
          userId,
          productId: parseInt(productId),
          quantity: quantity || 1
        }
      });
    }
    res.json(result);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Server error adding to cart' });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    const existingItem = await prisma.cart.findFirst({
      where: { userId, productId: parseInt(productId) }
    });

    if (!existingItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    if (quantity <= 0) {
      await prisma.cart.delete({ where: { id: existingItem.id } });
      return res.json({ message: 'Item removed from cart' });
    }

    const updated = await prisma.cart.update({
      where: { id: existingItem.id },
      data: { quantity }
    });
    res.json(updated);
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ message: 'Server error updating cart' });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const existingItem = await prisma.cart.findFirst({
      where: { userId, productId: parseInt(productId) }
    });

    if (existingItem) {
      await prisma.cart.delete({ where: { id: existingItem.id } });
    }
    res.json({ message: 'Item removed' });
  } catch (error) {
    console.error('Error removing cart item:', error);
    res.status(500).json({ message: 'Server error removing cart item' });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    await prisma.cart.deleteMany({
      where: { userId }
    });
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Server error clearing cart' });
  }
};
