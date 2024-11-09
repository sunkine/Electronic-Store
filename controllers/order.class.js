import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Account from "../models/account.model.js";
import axios from "axios";
import CryptoJS from "crypto-js";
import configPayment from "../config/configPayment.js";
import moment from "moment";
import qs from "qs"

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
    const cart = await Cart.findOne({ idAccount: userId }).populate("products.idProduct");
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

    // Lọc ra các sản phẩm đã mua khỏi giỏ hàng
    const purchasedProductIds = cart.products.map((item) => item.idProduct._id);
    cart.products = cart.products.filter(
      (item) => !purchasedProductIds.includes(item.idProduct._id)
    );
    // cart.products = []
    cart.isOrder = false;
    await cart.save();

    res
      .status(201)
      .json({ success: true, message: "Order created successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllOrder = async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit || 10);

  let filters = {}
  
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
  const _id = req.userAuthId;
  const account = await Account.findById(_id);
  
  if (!account) {
    return res.status(200).json({
      success: false,
      message: "Account not found.",
    });
  }
  
  try {
    const {id} = req.params;
    const page = parseInt(req.query.page);
    // Tìm các đơn hàng theo _id
    const orders = await Order.find({ idCustomer: id })
      .limit(10)
      .skip(page * 10);

    if (!orders) {
      return res
        .status(404)
        .json({ success: false, message: "No orders found" });
    }

    res.status(200).json({ success: true, total: orders.length, data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
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
      "https://a9fc-123-21-70-138.ngrok-free.app/order/callback",
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
        { status: "Thanh toán thành công" }
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

  let data = postData.app_id + "|" + postData.app_trans_id + "|" + configPayment.key1; // appid|app_trans_id|key1
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
