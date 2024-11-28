
import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import axios from "axios";
import CryptoJS from "crypto-js";
import configPayment from "../config/configPayment.js";
import moment from "moment";
import qs from "qs";
import jwt from "jsonwebtoken";
import { updateWarehouseAfterPayment } from "./warehouse.class.js";

// Controller tạo đơn hàng
export const createOrder = async (req, res) => {
  const _id = req.userAuthId;
  try {
    // Lấy thông tin giỏ hàng của người dùng
    const cart = await Cart.findOne({ idAccount: _id }).populate(
      "products.idProduct"
    );
    if (!cart || cart.products.length === 0) {
      return res.status(404).json({ success: false, message: "Cart is empty" });
    }

    const productIds = req.body.products.map((item) => item.idProduct);

    // Tính tổng tiền đơn hàng
    const totalPrice = cart.products.reduce((sum, item) => {
      if (productIds.includes(item.idProduct.toString())) {
        return sum + item.price * item.quantity;
      }
      return sum;
    }, 0);

    // Tạo đơn hàng mới
    const order = new Order({
      idCustomer: _id,
      idStaff: null,
      nameOfCustomer: req.body.nameOfCustomer,
      phone: req.body.phone,
      address: req.body.address,
      dateOrder: new Date(),
      dateReceived: req.body.dateReceived || null,
      totalPrice,
      payment_method: req.body.payment_method || "Cash",
      isPayment: req.body.isPayment || false,
      products: req.body.products,
      status: req.body.status || "Chờ xác nhận",
    });
    await order.save();
    // Kiểm tra phương thức thanh toán
    if (req.body.payment_method === "Bank") {
      const paymentToken = jwt.sign(
        { _id, idOrder: order._id, totalPrice, products: req.body.products },
        process.env.JWT_PAYMENT,
        { expiresIn: "1h" }
      );
      const linkPayment = `${req.protocol}://${req.get(
        "host"
      )}/auth/verify-payment/${paymentToken}`;
      order.linkPayment = linkPayment;
    } else if (req.body.payment_method === "Cod") {
      await updateWarehouseAfterPayment(order._id);
    }

    // Lưu đơn hàng vào cơ sở dữ liệu
    await order.save();

    // Xóa các sản phẩm đã mua khỏi giỏ hàng
    cart.products = cart.products.filter(
      (item) => !productIds.includes(item.idProduct.toString())
    );
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllOrder = async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit || 20);

  let filters = {};

  try {
    const order = await Order.find(filters)
      .limit(limit)
      .skip(page * limit);
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
  const { id } = req.params;
  try {
    // Tìm các đơn hàng theo _id
    const page = parseInt(req.query.page) || 0; // Default to page 0 if not specified
    const orders = await Order.find({ idCustomer: id })
      .limit(page)
      .skip(page * 10);

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No orders found" });
    }

    return res
      .status(200)
      .json({ success: true, total: orders.length, data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm đơn hàng theo idOrder và lấy chi tiết sản phẩm
    const order = await Order.findById(id).populate("products.idProduct");
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" }); //
    }

    res.status(200).json({
      success: true,
      message: "Order details fetched successfully",
      data: order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
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
  const {id} = req.params;

  try {
    // Lấy thông tin đơn hàng hiện tại
    const existingOrder = await Order.findById(id);
    if (!existingOrder) {
      return res
        .status(404)
        .json({ success: false, message: id });
    }

    if (req.body.idStaff) {
      req.body.status = "Đang giao";
    }

    // Cập nhật đơn hàng
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Successfully updated.",
      data: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const confirmOrder = async(req, res) => {
  const { id } = req.params;
  try {
    // Lấy thông tin đơn hàng hiện tại
    const existingOrder = await Order.findById(id);
    if (!existingOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        isPayment: true,
        status : "Đã giao",
        dateReceived: Date.now(), 
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Successfully updated.",
      data: updatedOrder,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export const payment = async (req, res) => {
  const orderInfo = req.body;
  const embed_data = {
    redirecturl: "https://www.google.com/",
  };

  const items = [{}];
  const transID = Math.floor(Math.random() * 1000000);
  const order = {
    app_id: configPayment.app_id,
    app_trans_id: `${moment().format("YYMMDD")}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
    app_user: orderInfo._id,
    app_time: Date.now(),
    phone: orderInfo.phone,
    address: orderInfo.address,
    item: JSON.stringify(items),
    embed_data: JSON.stringify(embed_data),
    amount: orderInfo.totalPrice,
    description: `Payment for the order #${transID}`,
    bank_code: "",
    callback_url:
      "https://448a-2402-800-63a3-ff6a-d1e5-499b-9ba9-fbbc.ngrok-free.app/services/callback",
  };

  // appid|app_trans_id|appuser|amount|apptime|embeddata|item
  const data =
    configPayment.app_id +
    "|" +
    order.app_trans_id +
    "|" +
    order.app_user +
    "|" +
    order.amount +
    "|" +
    order.app_time +
    "|" +
    order.embed_data +
    "|" +
    order.item;
  order.mac = CryptoJS.HmacSHA256(data, configPayment.key1).toString();

  try {
    const result = await axios.post(configPayment.endpoint, null, {
      params: order,
    });

    return res.status(200).json(result.data);
  } catch (error) {
    console.log(error);
  }
};

export const callback = async (req, res) => {
  let result = {};

  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;

    let mac = CryptoJS.HmacSHA256(dataStr, configPayment.key2).toString();
    console.log("mac =", mac);

    // kiểm tra callback hợp lệ (đến từ ZaloPay server)
    if (reqMac !== mac) {
      // callback không hợp lệ
      result.return_cosde = -1;
      result.return_message = "mac not equal";
    } else {
      // thanh toán thành công
      // merchant cập nhật trạng thái cho đơn hàng
      let dataJson = JSON.parse(dataStr, configPayment.key2);

      await Order.findOneAndUpdate(
        { _id: dataJson["app_user"] },
        { isPayment: true }
      );
      console.log(
        "update order's status = success where app_trans_id =",
        dataJson["app_trans_id"]
      );

      result.return_code = 1;
      result.return_message = "success";
    }
  } catch (ex) {
    result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
    result.return_message = ex.message;
  }

  // thông báo kết quả cho ZaloPay server
  res.json(result);
};

export const checkStatusOrder = async (req, res) => {
  const { app_trans_id } = req.body;

  let postData = {
    app_id: configPayment.app_id,
    app_trans_id, // Input your app_trans_id
  };

  let data =
    postData.app_id + "|" + postData.app_trans_id + "|" + configPayment.key1; // appid|app_trans_id|key1
  postData.mac = CryptoJS.HmacSHA256(data, configPayment.key1).toString();

  let postConfig = {
    method: "post",
    url: "https://sb-openapi.zalopay.vn/v2/query",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: qs.stringify(postData),
  };

  try {
    const result = await axios(postConfig);
    console.log(result.data);
    return res.status(200).json(result.data);
  } catch (error) {
    console.log("lỗi");
    console.log(error);
  }
};
