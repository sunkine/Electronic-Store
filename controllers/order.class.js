import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import { verifyToken } from "../middlewares/checkLogin.js";

export const createOrder = async (req, res) => {
  const token = req.cookies.userAuthId;
  const userId = verifyToken(token);

  if (!userId) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }

  try {
    // Lấy thông tin giỏ hàng của người dùng
    const cart = await Cart.findOne({ userId }).populate("products.idProduct");
    if (!cart || cart.products.length === 0) {
      return res.status(404).json({ success: false, message: "Cart is empty" });
    }

    // Tính tổng tiền đơn hàng
    const totalPrice = cart.products.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Tạo đơn hàng mới
    const order = new Order({
      nameCustomer: req.body.nameCustomer,
      phone: req.body.phone,
      address: req.body.address,
      dateOrder: new Date(),
      dateReceived: req.body.dateReceived || null, // Ngày nhận hàng có thể tùy chọn
      totalPrice,
      payment_method: req.body.payment_method || "Cash",
      isPayment: req.body.isPayment || false,
      idCart: cart._id,
      status: req.body.status || "Chờ xác nhận"
    });

    // Lưu đơn hàng vào cơ sở dữ liệu
    await order.save();

    // Làm trống giỏ hàng sau khi tạo đơn hàng thành công
    cart.products = [];
    cart.isOrder = false;
    await cart.save();

    res.status(201).json({ success: true, message: "Order created successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};