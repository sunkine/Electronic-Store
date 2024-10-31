import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import Account from "../models/account.model.js";

export const addToCart = async (req, res) => {
  const { idProduct, quantity = 1 } = req.body;

  const userId = req.userAuthId;
  const account = await Account.findById(userId);

  if (!account) {
    return res.status(200).json({
      success: false,
      message: "Account not found.",
    });
  }

  try {
    const product = await Product.findOne({ idProduct });
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const { nameOfProduct, price } = product;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({
        userId,
        products: [{ idProduct, quantity, nameOfProduct, price }],
      });
    } else {
      const itemIndex = cart.products.findIndex(
        (item) => item.idProduct.toString() === idProduct
      );
      if (itemIndex > -1) {
        cart.products[itemIndex].quantity += quantity;
      } else {
        cart.products.push({ idProduct, quantity, nameOfProduct, price });
      }
    }

    await cart.save();
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteFromCart = async (req, res) => {
  const { idProduct } = req.body;

  const userId = req.userAuthId;
  const account = await Account.findById(userId);

  if (!account) {
    return res.status(200).json({
      success: false,
      message: "Account not found.",
    });
  }

  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(
      (item) => item.idProduct.toString() === idProduct
    );

    if (productIndex > -1) {
      cart.products.splice(productIndex, 1);
      await cart.save();
      return res
        .status(200)
        .json({ success: true, message: "Product removed from cart", data: cart });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Product not found in cart" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllCart = async (req, res) => {
  const page = parseInt(req.query.page);
  try {
    const cart = await Cart.find()
      .limit(10)
      .skip(page * 10);
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart is empty." });
    } else {
      res.status(200).json({
        success: true,
        message: "Successfully get all cart.",
        total: cart.length,
        data: cart,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCartById = async (req, res) => {
  const _id = req.userAuthId;
  const account = await Account.findById(_id);

  if (!account) {
    return res.status(200).json({
      success: false,
      message: "Account not found.",
    });
  }

  try {
    const cart = await Cart.findOne({userId: _id});

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found with this account." });
    } else {
      res.status(200).json({
        success: true,
        message: "Successfully get cart.",
        data: cart,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
