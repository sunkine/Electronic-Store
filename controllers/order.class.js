import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Account from "../models/account.model.js";

export const createOrder = async (req, res) => {
  const userId = req.userAuthId;
  const account = await Account.findById(userId);

  if (!account) {
    return res.status(200).json({
      success: false,
      message: "Account not found.",
    });
  }

  try {
    // Lấy thông tin giỏ hàng của người dùng
    const cart = await Cart.findOne({ userId }).populate("products.idProduct");
    if (!cart || cart.products.length === 0) {
      return res.status(404).json({ success: false, message: "Cart is empty" });
    }

    // Tính tổng tiền đơn hàng
    const totalPrice = cart.products.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Tạo đơn hàng mới
    const order = new Order({
      idCustomer: userId,
      nameCustomer: req.body.nameCustomer,
      phone: req.body.phone,
      address: req.body.address,
      dateOrder: new Date(),
      dateReceived: req.body.dateReceived || null, // Ngày nhận hàng có thể tùy chọn
      totalPrice,
      payment_method: req.body.payment_method || "Cash",
      isPayment: req.body.isPayment || false,
      idCart: cart._id,
      status: req.body.status || "Chờ thanh toán",
    });

    // Lưu đơn hàng vào cơ sở dữ liệu
    await order.save();

    // Làm trống giỏ hàng sau khi tạo đơn hàng thành công
    cart.products = [];
    cart.isOrder = false;
    await cart.save();

    res
      .status(201)
      .json({ success: true, message: "Order created successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllOrder = async (req, res) => {
  const page = parseInt(req.query.page);
  try {
    const order = await Order.find()
      .limit(10)
      .skip(page * 10);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order is empty." });
    } else {
      res.status(200).json({
        success: true,
        message: "Successfully get all order.",
        total: order.length,
        data: order,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  const accountId = req.userAuthId; // Lấy ID tài khoản từ middleware xác thực
  const orderId = req.params.id; // Lấy ID đơn hàng từ URL params

  try {
    const account = await Account.findById(accountId); // Tìm tài khoản theo ID

    if (!account) {
      return res.status(404).json({ success: false, message: "Account not found." });
    }

    // Nếu có orderId thì tìm theo ID đơn hàng, nếu không thì tìm theo idCustomer
    if (orderId) {
      const order = await Order.findById(orderId); // Tìm đơn hàng theo ID
      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }
      return res.status(200).json({ success: true, data: order }); // Trả về đơn hàng tìm được
    } else {
      const page = parseInt(req.query.page) || 0; // Lấy số trang từ query, mặc định là 0
      const orders = await Order.find({ idCustomer: accountId }) // Tìm các đơn hàng theo idCustomer
        .limit(10)
        .skip(page * 10);

      if (!orders.length) {
        return res.status(404).json({ success: false, message: "No orders found" });
      }

      return res.status(200).json({ success: true, total: orders.length, data: orders });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};



export const deleteOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      res.status(404).json({ success: false, message: "Order not found." });
    } else {
      res.status(200).json({
        success: true,
        message: "Successfully delete an order.",
        data: order,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const idOrder = await Order.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    );

    if (!idOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    } else {
      res.status(200).json({
        success: true,
        messgae: "Successfully updated.",
        data: idOrder,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
