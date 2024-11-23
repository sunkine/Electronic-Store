// In statistics.class.js
import Order from "../models/order.model.js"; // Assuming orders are linked with products

export const getBestSellingProducts = async (req, res) => {
  try {
    const products = await Order.aggregate([
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.idProduct",
          totalQuantity: { $sum: "$products.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$products.quantity", "$products.price"] },
          },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $project: {
          nameOfProduct: "$productDetails.nameOfProduct",
          quantitySold: "$totalQuantity",
          totalRevenue: "$totalRevenue",
        },
      },
    ]);

    res.json({ bestSellingProducts: products });
  } catch (error) {
    console.error("Error fetching best-selling products:", error);
    res.status(500).json({ message: "Error fetching data" });
  }
};
