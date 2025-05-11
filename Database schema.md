# Smart-Dhaba Database Schema

This document outlines the database schema for the Smart-Dhaba application. The application uses MongoDB, a NoSQL document database, with Mongoose as the ODM (Object Data Modeling) library.

## Collections

### User

```javascript
{
  username: String,         // required, trimmed
  email: String,            // required, unique, lowercase
  password: String,         // required, hashed
  role: String,             // enum: ["student", "faculty", "server", "admin"], default: "student"
  picture: String,          // URL to user's profile picture
  location: {
    lat: Number,
    lng: Number
  },
  resetToken: String,       // for password reset functionality
  resetTokenExpiry: Date,   // expiry for reset token
  createdAt: Date,          // automatically managed by Mongoose
  updatedAt: Date           // automatically managed by Mongoose
}
```

### MenuItem

```javascript
{
  name: String,             // required, trimmed
  category: String,         // enum: ["Snacks", "Drinks", "Meals"], required
  price: Number,            // required
  description: String,      // default: ""
  isAvailable: Boolean,     // default: true
  customizationOptions: {
    spiceLevels: [String],
    addons: [String]
  },
  image: String,            // URL to item image
  createdAt: Date,          // automatically managed by Mongoose
  updatedAt: Date           // automatically managed by Mongoose
}
```

### Order

```javascript
{
  userId: ObjectId,         // reference to User, required
  groupId: ObjectId,        // reference to Group, default: null
  items: [
    {
      menuItem: ObjectId,   // reference to MenuItem
      quantity: Number,
      customization: {
        spiceLevel: String,
        addons: [String]
      }
    }
  ],
  totalAmount: Number,      // required
  serverId: ObjectId,       // reference to Server user, default: null
  tableId: ObjectId,        // reference to Table, default: null
  orderStatus: String,      // enum: ["Pending", "Preparing", "Ready", "Completed", "Cancelled"], default: "Pending"
  paymentStatus: String,    // enum: ["Unpaid", "Paid"], default: "Unpaid"
  createdAt: Date,          // automatically managed by Mongoose
  updatedAt: Date           // automatically managed by Mongoose
}
```

### Group

```javascript
{
  name: String,             // required
  members: [ObjectId],      // references to User
  createdBy: ObjectId,      // reference to User, required
  createdAt: Date,          // automatically managed by Mongoose
  updatedAt: Date           // automatically managed by Mongoose
}
```

### Table

```javascript
{
  tableNumber: Number,      // required, unique
  capacity: Number,         // required
  isOccupied: Boolean,      // default: false
  currentGroup: ObjectId,   // reference to Group, default: null
  createdAt: Date,          // automatically managed by Mongoose
  updatedAt: Date           // automatically managed by Mongoose
}
```

### Server

```javascript
{
  userId: ObjectId,         // reference to User, required
  assignedTables: [ObjectId], // references to Table
  isAvailable: Boolean,     // default: true
  createdAt: Date,          // automatically managed by Mongoose
  updatedAt: Date           // automatically managed by Mongoose
}
```

### Rating

```javascript
{
  userId: ObjectId,         // reference to User, required
  orderId: ObjectId,        // reference to Order, required
  rating: Number,           // required, 1-5
  comment: String,
  createdAt: Date,          // automatically managed by Mongoose
  updatedAt: Date           // automatically managed by Mongoose
}
```

### ChatMessage

```javascript
{
  sender: ObjectId,         // reference to User, required
  recipients: [ObjectId],   // references to User or Group
  message: String,          // required
  groupId: ObjectId,        // reference to Group, optional
  createdAt: Date,          // automatically managed by Mongoose
  updatedAt: Date           // automatically managed by Mongoose
}
```

## Relationships

1. **User to Order**: One-to-Many (A user can place multiple orders)
2. **User to Group**: Many-to-Many (Users can be part of multiple groups)
3. **Group to Order**: One-to-Many (A group can place multiple orders)
4. **MenuItem to Order**: Many-to-Many (Orders can contain multiple menu items, and menu items can be in multiple orders)
5. **Server to Table**: One-to-Many (A server can be assigned to multiple tables)
6. **User to Rating**: One-to-Many (A user can give multiple ratings)
7. **Order to Rating**: One-to-One (An order can have one rating)
8. **User to ChatMessage**: One-to-Many (A user can send multiple chat messages)

## Indexes

For optimal performance, consider creating the following indexes:

1. `User.email` (unique)
2. `MenuItem.category`
3. `Order.userId`
4. `Order.groupId`
5. `Order.orderStatus`
6. `Table.tableNumber` (unique)
7. `Rating.orderId`
8. `ChatMessage.groupId`

## Schema Versioning

When making changes to the schema, follow these best practices:

1. Add new fields with sensible defaults
2. Avoid removing fields unless absolutely necessary
3. Document all schema changes
4. Run migration scripts for significant changes
