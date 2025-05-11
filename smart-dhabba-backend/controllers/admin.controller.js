const User = require("../models/User");
const Order = require("../models/Order");

const getAdminSummary = async (req, res) => {
  const users = await User.countDocuments();
  const orders = await Order.countDocuments();
  const topItems = await Order.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.menuItem",
        totalSold: { $sum: "$items.quantity" },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "menuitems",
        localField: "_id",
        foreignField: "_id",
        as: "itemDetails",
      },
    },
    {
      $project: {
        _id: 1,
        totalSold: 1,
        name: { $arrayElemAt: ["$itemDetails.name", 0] },
      },
    },
  ]);

  res.json({ users, orders, topItems });
};

module.exports = {
  getAdminSummary,
};
