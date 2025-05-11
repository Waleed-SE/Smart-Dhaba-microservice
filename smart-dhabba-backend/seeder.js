const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { faker } = require("@faker-js/faker");
const bcrypt = require("bcryptjs");

const User = require("./models/User");
const MenuItem = require("./models/MenuItem");
const Table = require("./models/Table");
const Order = require("./models/Order");
const Group = require("./models/Group");
const Rating = require("./models/Rating");
const ChatMessage = require("./models/ChatMessage");
const Server = require("./models/Server");

dotenv.config();
mongoose.connect(process.env.MONGO_URI, {});

const seedUsers = async () => {
  const roles = ["student", "faculty", "server"];
  const users = [];

  for (let i = 0; i < 30; i++) {
    const role = roles[Math.floor(Math.random() * roles.length)];
    const hashed = await bcrypt.hash("123456", 10);
    users.push(
      new User({
        username: faker.person.fullName(),
        email: faker.internet.email(),
        password: hashed,
        role,
      })
    );
  }

  // Add an admin
  const admin = new User({
    username: "Admin User",
    email: "admin@smartdhabba.com",
    password: await bcrypt.hash("admin123", 10),
    role: "admin",
  });

  users.push(admin);
  await User.insertMany(users);
  console.log("✅ Users Seeded");
};

const seedMenu = async () => {
  const categories = ["Snacks", "Drinks", "Meals"];
  const items = [];

  for (let i = 0; i < 40; i++) {
    const cat = categories[Math.floor(Math.random() * categories.length)];
    items.push(
      new MenuItem({
        name: faker.commerce.productName(),
        category: cat,
        price: faker.number.int({ min: 50, max: 300 }),
        description: faker.commerce.productDescription(),
        isAvailable: true,
        customizationOptions: {
          spiceLevels: ["Mild", "Medium", "Spicy"],
          addons: ["Cheese", "Sauce", "Extra Veggies"],
        },
      })
    );
  }

  await MenuItem.insertMany(items);
  console.log("✅ Menu Items Seeded");
};

const seedTables = async () => {
  const tables = [];

  for (let i = 1; i <= 15; i++) {
    tables.push(
      new Table({
        tableNumber: `T${i}`,
        capacity: faker.number.int({ min: 2, max: 8 }),
        isReserved: false,
      })
    );
  }

  await Table.insertMany(tables);
  console.log("✅ Tables Seeded");
};

const seedOrders = async (users, menuItems, tables) => {
  const orders = [];

  for (let i = 0; i < 20; i++) {
    const user = faker.helpers.arrayElement(
      users.filter((u) => u.role !== "admin")
    );
    const item = faker.helpers.arrayElement(menuItems);
    const table = faker.helpers.arrayElement(tables);

    orders.push(
      new Order({
        userId: user._id,
        items: [
          {
            menuItem: item._id,
            quantity: faker.number.int({ min: 1, max: 3 }),
            customization: {
              spiceLevel: faker.helpers.arrayElement(["Mild", "Spicy"]),
              addons: ["Cheese"],
            },
          },
        ],
        totalAmount: item.price * 2,
        serverId: users.find((u) => u.role === "server")._id,
        tableId: table._id,
        orderStatus: "Completed",
        paymentStatus: "Paid",
        isFacultyPriority: user.role === "faculty",
      })
    );
  }

  await Order.insertMany(orders);
  console.log("✅ Orders Seeded");
};

const seedGroups = async (users) => {
  const studentUsers = users.filter((u) => u.role === "student");
  const group = new Group({
    groupName: "Group Alpha",
    members: studentUsers
      .slice(0, 3)
      .map((u) => ({ user: u._id, hasAccepted: true })),
    admins: [studentUsers[0]._id],
    createdBy: studentUsers[0]._id,
  });

  await group.save();
  console.log("✅ Group Seeded");
  return group;
};

const seedRatings = async (orders, users) => {
  const ratings = orders.slice(0, 10).map((order) => ({
    orderId: order._id,
    ratedBy: order.userId,
    ratedServerId: order.serverId,
    ratingValue: faker.number.int({ min: 3, max: 5 }),
    feedbackText: faker.lorem.sentence(),
  }));

  await Rating.insertMany(ratings);
  console.log("✅ Ratings Seeded");
};

const seedChat = async (group, users) => {
  const messages = users.slice(0, 3).map((user) => ({
    groupId: group._id,
    senderId: user._id,
    message: faker.lorem.sentence(),
  }));

  await ChatMessage.insertMany(messages);
  console.log("✅ Group Chat Seeded");
};

const seedServerProfiles = async (users) => {
  const servers = users.filter((u) => u.role === "server");
  const serverProfiles = servers.map((serverUser) => ({
    userId: serverUser._id,
    isAvailable: faker.datatype.boolean(),
    averageRating: faker.number.float({ min: 3, max: 5, precision: 0.1 }),
    totalOrders: faker.number.int({ min: 5, max: 50 }),
    feedback: [
      {
        rating: faker.number.int({ min: 3, max: 5 }),
        comment: faker.lorem.sentence(),
        fromUser: faker.helpers.arrayElement(users)._id,
      },
    ],
  }));

  await Server.insertMany(serverProfiles);
  console.log("✅ Server Profiles Seeded");
};

const seedAll = async () => {
  try {
    await User.deleteMany();
    await MenuItem.deleteMany();
    await Table.deleteMany();
    await Order.deleteMany();
    await Group.deleteMany();
    await Rating.deleteMany();
    await ChatMessage.deleteMany();
    await Server.deleteMany(); // 👈 clear server collection too

    await seedUsers();
    await seedMenu();
    await seedTables();

    const users = await User.find();
    const menuItems = await MenuItem.find();
    const tables = await Table.find();

    await seedServerProfiles(users); // 👈 Add this here

    await seedOrders(users, menuItems, tables);
    const group = await seedGroups(users);
    const orders = await Order.find();
    await seedRatings(orders, users);
    await seedChat(group, users);

    console.log("🌱 Database Seeding Complete");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding Failed:", err);
    process.exit(1);
  }
};

seedAll();
