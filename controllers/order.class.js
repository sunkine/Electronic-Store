import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";

export const createOrder = async (req, res) => {
  try {
    const data = req.body;

    const order = await Order.create(data);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Failed to create order" });
    }

    const updateIsOrder = await Cart.findByIdAndUpdate(data.idCart, {
      isOrder: true,
    });

    if (!updateIsOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Failed to create order" });
    }

    return res.status(201).json(order);
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};
