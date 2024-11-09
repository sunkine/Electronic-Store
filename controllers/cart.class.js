import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import Account from "../models/account.model.js";

export const addToCart = async (req, res) => {
  const { idProduct, quantity = 1 } = req.body;
  const _id = req.userAuthId;
  try {
    const product = await Product.findById(idProduct);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const { nameOfProduct, price } = product;

    let cart = await Cart.findOne({ idAccount: _id });
    if (!cart) {
      cart = new Cart({
        idAccount: _id,
        products: [{ idProduct, quantity, nameOfProduct, price }],
      });
    } else {
      const itemIndex = cart.products.findIndex(
        (item) => item.idProduct === idProduct
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

export const deleteCart = async (req, res) => {
  const { id } = req.params;
  const cart = await Cart.findByIdAndDelete(id);

  if (!cart) {
    return res.status(404).json({ success: false, message: "Cart not found" });
  } else {
    return res.status(200).json({
      success: true,
      message: "Deleting cart successfully",
      data: cart,
    });
  }
};

export const deleteFromCart = async (req, res) => {
  const { idProduct, idCart } = req.body;
  try {
    // Tìm giỏ hàng bằng idAccount
    const cart = await Cart.findOne({ idAccount: idCart });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    // Tìm chỉ mục sản phẩm trong giỏ hàng
    const productIndex = cart.products.findIndex((item) => item.idProduct.toString() === idProduct);

    // Kiểm tra sản phẩm và xóa nếu có
    if (productIndex > -1) {
      cart.products.splice(productIndex, 1);
      await cart.save();

      return res.status(200).json({
        success: true,
        message: "Product removed from cart",
        data: cart,
      });
    } else {
      return res.status(404).json({ success: false, message: "Product not found in cart" });
    }
  } catch (error) {
    console.error("Error deleting product from cart:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export const getAllCart = async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit || 10);

  let filters = {};

  try {
    const cart = await Cart.find(filters)
      .limit(limit)
      .skip(page * limit);
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
  const { id } = req.params;

  try {
    const cart = await Cart.findById(id);
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

export const clearCart = async (req, res) => {
  const _id = req.userAuthId;

  try {
    // Tìm giỏ hàng của người dùng
    const cart = await Cart.findOne({ idAccount: _id });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    if (cart.products.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "Cart already empty" });
    }

    // Làm trống giỏ hàng
    cart.products = [];
    await cart.save();

    res
      .status(200)
      .json({ success: true, message: "Cart cleared successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateCart = async (req, res) => {
  const { id } = req.params;
  const { idProduct, quantity } = req.body; // quantity sẽ là +1 hoặc -1 tùy thuộc vào hành động

  try {
    // Tìm giỏ hàng theo id
    const cart = await Cart.findById(id);
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    // Tìm sản phẩm trong giỏ hàng dựa trên productId
    const productIndex = cart.products.findIndex(
      (product) => product.idProduct.toString() === idProduct
    );

    if (productIndex === -1) {
      return res.status(404).json({ success: false, message: "Product not found in cart" });
    }

    // Cập nhật số lượng sản phẩm, đảm bảo số lượng tối thiểu là 1
    const newQuantity = Number(cart.products[productIndex].quantity) + Number(quantity);
    cart.products[productIndex].quantity = Math.max(1, newQuantity);

    // Lưu lại giỏ hàng
    const updatedCart = await cart.save();

    res.status(200).json({
      success: true,
      message: "Successfully updated quantity.",
      data: updatedCart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
