import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Account from "../models/account.model.js";
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

// export const getOneOrder = async (req, res) => {
//   try {
//     const _id = req.userAuthId;
//     const account = await Account.findById(_id);

//     if (!account) {
//       return res.status(200).json({
//         success: false,
//         message: "Account not found.",
//       });
//     }

//     const order = 

//     // Trả về thông tin người dùng
//     res.status(200).json({
//       success: true,
//       message: "Successfully get user information.",
//       data: user,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

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