import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';

export const addToCart = async (req, res) => {
    const { idProduct, quantity = 1 } = req.body;
    const userId = req.cookies.userAuthId; // lấy userId từ middleware

    try {
        const product = await Product.findById(idProduct);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, products: [{ idProduct, quantity, nameOfProduct, price }] });
        } else {
            const itemIndex = cart.products.findIndex(item => item.idProduct.toString() === idProduct);
            if (itemIndex > -1) {
                cart.products[itemIndex].quantity += quantity;
            } else {
                cart.products.push({ idProduct, quantity, nameOfProduct, price });
            }
        }

        await cart.save();
        res.status(200).json({ success: true, cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const deleteFromCart = async (req, res) => {
    const { idProduct } = req.body;
    const userId = req.cookies.userAuthId;

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        cart.products = cart.products.filter(item => item.idProduct.toString() !== idProduct);
        await cart.save();

        res.status(200).json({ success: true, cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
