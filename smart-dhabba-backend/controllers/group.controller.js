const Group = require("../models/Group");

const createGroup = async (req, res) => {
  try {
    const { groupName, members } = req.body;
    const group = new Group({
      groupName,
      members: members.map((id) => ({ user: id })),
      admins: [req.user._id],
      createdBy: req.user._id,
    });

    await group.save();
    res.status(201).json({ message: "Group created", group });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getMyGroups = async (req, res) => {
  try {
    const groups = await Group.find({ "members.user": req.user._id });
    res.status(200).json(groups);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch groups" });
  }
};

const updateGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group || !group.admins.includes(req.user._id)) {
      return res.status(403).json({ error: "Unauthorized or group not found" });
    }

    group.groupName = req.body.groupName || group.groupName;
    await group.save();

    res.status(200).json({ message: "Group updated", group });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteGroup = async (req, res) => {
  try {
    await Group.findByIdAndDelete(req.params.groupId);
    res.status(200).json({ message: "Group deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const manageMembers = async (req, res) => {
  const { groupId } = req.params;
  const { action, userId } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });

    const currentUserId = req.user._id.toString();
    const targetUserId = userId.toString();

    if (!group.admins.map((id) => id.toString()).includes(currentUserId)) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    switch (action) {
      case "add":
        if (!group.members.some((m) => m.user.toString() === targetUserId)) {
          group.members.push({ user: userId });
        }
        break;

      case "remove":
        group.members = group.members.filter(
          (m) => m.user.toString() !== targetUserId
        );
        group.admins = group.admins.filter(
          (a) => a.toString() !== targetUserId
        );
        break;

      case "promote":
        if (!group.admins.includes(userId)) group.admins.push(userId);
        break;

      case "demote":
        if (
          group.admins.length === 1 &&
          group.admins[0].toString() === targetUserId
        ) {
          return res
            .status(400)
            .json({ error: "Cannot demote the only admin" });
        }
        group.admins = group.admins.filter(
          (a) => a.toString() !== targetUserId
        );
        break;

      default:
        return res.status(400).json({ error: "Invalid action" });
    }

    await group.save();
    res.status(200).json({ message: "Group updated", group });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const calculateSplit = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const group = await Group.findById(groupId).populate("members.user");

    if (!group) return res.status(404).json({ error: "Group not found" });

    // Fetch related orders
    const Order = require("../models/Order");
    const orders = await Order.find({ groupId });

    const totalAmount = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    // Count only accepted users
    const acceptedMembers = group.members.filter((m) => m.hasAccepted);
    const share =
      acceptedMembers.length > 0 ? totalAmount / acceptedMembers.length : 0;

    const result = acceptedMembers.map((m) => ({
      userId: m.user._id,
      username: m.user.username,
      share: Number(share.toFixed(2)),
    }));

    res.status(200).json({
      groupId,
      totalAmount,
      acceptedCount: acceptedMembers.length,
      splits: result,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const toggleBillingAcceptance = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });

    const member = group.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );
    if (!member)
      return res
        .status(403)
        .json({ error: "You are not a member of this group" });

    member.hasAccepted = !member.hasAccepted;
    await group.save();

    res.status(200).json({
      message: "Billing status updated",
      hasAccepted: member.hasAccepted,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createGroup,
  getMyGroups,
  updateGroup,
  deleteGroup,
  manageMembers,
  toggleBillingAcceptance,
  calculateSplit,
};
