const Order = require("../models/Order");
const Rating = require("../models/Rating");

const getTotalOrdersToday = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const count = await Order.countDocuments({
      createdAt: { $gte: start, $lte: end },
    });
    res.status(200).json({ totalOrdersToday: count });
  } catch (err) {
    res.status(500).json({ error: "Failed to count orders" });
  }
};

const getTopItems = async (req, res) => {
  try {
    const pipeline = [
      { $unwind: "$items" },
      {
        $group: { _id: "$items.menuItem", total: { $sum: "$items.quantity" } },
      },
      { $sort: { total: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "menuitems",
          localField: "_id",
          foreignField: "_id",
          as: "itemDetails",
        },
      },
      { $unwind: "$itemDetails" },
    ];

    const result = await Order.aggregate(pipeline);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to get top items" });
  }
};

const getTopRatedServers = async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: "$ratedServerId",
          avgRating: { $avg: "$ratingValue" },
          total: { $sum: 1 },
        },
      },
      { $sort: { avgRating: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "serverInfo",
        },
      },
      { $unwind: "$serverInfo" },
    ];

    const result = await Rating.aggregate(pipeline);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to get top-rated servers" });
  }
};

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
  getTotalOrdersToday,
  getTopItems,
  getTopRatedServers,
  getAdminSummary,
};
