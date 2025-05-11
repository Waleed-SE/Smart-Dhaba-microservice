# Smart-Dhaba API Documentation

This document provides comprehensive information about the Smart-Dhaba API endpoints, their functionality, required parameters, and expected responses.

## Table of Contents

1. [Authentication](#authentication)
2. [User Management](#user-management)
3. [Menu Management](#menu-management)
4. [Order Management](#order-management)
5. [Group Management](#group-management)
6. [Rating System](#rating-system)
7. [Server Management](#server-management)
8. [Admin Dashboard](#admin-dashboard)
9. [Analytics](#analytics)
10. [File Upload](#file-upload)

---

## Base URL

```
http://localhost:5000/api
```

---

## Authentication

Authentication endpoints for user registration, login, and password management.

### Register a New User

**Endpoint:** `POST /auth/signup`

**Description:** Register a new user with Smart-Dhaba.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "secure_password",
  "role": "student" // Optional, defaults to "student"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "student"
    }
  }
}
```

### User Login

**Endpoint:** `POST /auth/login`

**Description:** Authenticate a user and get a token.

**Request Body:**

```json
{
  "email": "john.doe@example.com",
  "password": "secure_password"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "student"
    }
  }
}
```

### Google Authentication

**Endpoint:** `POST /auth/google`

**Description:** Authenticate a user using Google credentials.

**Request Body:**

```json
{
  "token": "google_auth_token"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "student"
    }
  }
}
```

### Forgot Password

**Endpoint:** `POST /auth/forgot-password`

**Description:** Request a password reset link.

**Request Body:**

```json
{
  "email": "john.doe@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

### Reset Password

**Endpoint:** `POST /auth/reset-password/:token`

**Description:** Reset password using the token from the email.

**Request Body:**

```json
{
  "password": "new_secure_password"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Password has been reset"
}
```

---

## User Management

Endpoints for managing user accounts and profiles.

### Get All Users (Admin Only)

**Endpoint:** `GET /admin/users`

**Description:** Get a list of all users.

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "student"
    },
    {
      "_id": "user_id2",
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
      "role": "admin"
    }
  ]
}
```

### Update User Role (Admin Only)

**Endpoint:** `PUT /admin/users/:userId/role`

**Description:** Update a user's role.

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "role": "server"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "server"
  }
}
```

### Deactivate User (Admin Only)

**Endpoint:** `DELETE /admin/users/:userId`

**Description:** Deactivate a user account.

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Response:**

```json
{
  "success": true,
  "message": "User successfully deactivated"
}
```

### Promote to Server (Admin Only)

**Endpoint:** `PUT /admin/users/:userId/promote-server`

**Description:** Promote a user to server role.

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "server"
    },
    "server": {
      "_id": "server_id",
      "user": "user_id",
      "startDate": "2023-05-11T00:00:00.000Z",
      "active": true
    }
  }
}
```

### Save Student Location

**Endpoint:** `POST /users/save-location`

**Description:** Save a student's current location.

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "latitude": 37.7749,
  "longitude": -122.4194
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "location": {
      "latitude": 37.7749,
      "longitude": -122.4194,
      "updatedAt": "2023-05-11T00:00:00.000Z"
    }
  }
}
```

### Get All Student Locations (Admin Only)

**Endpoint:** `GET /users/students-locations`

**Description:** Get locations of all students.

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "user_id",
      "name": "John Doe",
      "location": {
        "latitude": 37.7749,
        "longitude": -122.4194,
        "updatedAt": "2023-05-11T00:00:00.000Z"
      }
    }
  ]
}
```

---

## Menu Management

Endpoints for managing the food menu.

### Get All Menu Items

**Endpoint:** `GET /menu`

**Description:** Get all menu items.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "item_id",
      "name": "Butter Chicken",
      "description": "Creamy tomato curry with chicken",
      "price": 250,
      "category": "main",
      "image": "image_url",
      "available": true
    }
  ]
}
```

### Create Menu Item (Admin Only)

**Endpoint:** `POST /menu`

**Description:** Create a new menu item.

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "name": "Butter Chicken",
  "description": "Creamy tomato curry with chicken",
  "price": 250,
  "category": "main",
  "image": "image_url",
  "available": true
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "item_id",
    "name": "Butter Chicken",
    "description": "Creamy tomato curry with chicken",
    "price": 250,
    "category": "main",
    "image": "image_url",
    "available": true
  }
}
```

### Update Menu Item (Admin Only)

**Endpoint:** `PUT /menu/:id`

**Description:** Update an existing menu item.

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "price": 270,
  "available": false
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "item_id",
    "name": "Butter Chicken",
    "description": "Creamy tomato curry with chicken",
    "price": 270,
    "category": "main",
    "image": "image_url",
    "available": false
  }
}
```

### Delete Menu Item (Admin Only)

**Endpoint:** `DELETE /menu/:id`

**Description:** Delete a menu item.

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Response:**

```json
{
  "success": true,
  "message": "Menu item deleted successfully"
}
```

---

## Order Management

Endpoints for managing food orders.

### Place Order

**Endpoint:** `POST /orders`

**Description:** Place a new food order.

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "items": [
    {
      "menuItem": "item_id",
      "quantity": 2,
      "notes": "Extra spicy"
    }
  ],
  "tableNumber": 5,
  "groupId": "group_id" // Optional
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "order_id",
    "user": "user_id",
    "items": [
      {
        "menuItem": {
          "_id": "item_id",
          "name": "Butter Chicken",
          "price": 250
        },
        "quantity": 2,
        "notes": "Extra spicy",
        "subtotal": 500
      }
    ],
    "status": "placed",
    "tableNumber": 5,
    "totalAmount": 500,
    "placedAt": "2023-05-11T00:00:00.000Z",
    "paymentStatus": "pending"
  }
}
```

### Get User Orders

**Endpoint:** `GET /orders/my-orders`

**Description:** Get all orders placed by the authenticated user.

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "order_id",
      "user": "user_id",
      "items": [
        {
          "menuItem": {
            "_id": "item_id",
            "name": "Butter Chicken",
            "price": 250
          },
          "quantity": 2,
          "notes": "Extra spicy",
          "subtotal": 500
        }
      ],
      "status": "delivered",
      "tableNumber": 5,
      "totalAmount": 500,
      "placedAt": "2023-05-11T00:00:00.000Z",
      "paymentStatus": "paid"
    }
  ]
}
```

### Update Order Status

**Endpoint:** `PUT /orders/:orderId/status`

**Description:** Update the status of an order.

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "status": "preparing"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "order_id",
    "status": "preparing",
    "updatedAt": "2023-05-11T00:00:00.000Z"
  }
}
```

### Get Order Invoice

**Endpoint:** `GET /orders/:orderId/invoice`

**Description:** Get the invoice for a specific order.

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Response:**

```json
{
  "success": true,
  "data": {
    "orderId": "order_id",
    "customer": "John Doe",
    "items": [
      {
        "name": "Butter Chicken",
        "price": 250,
        "quantity": 2,
        "subtotal": 500
      }
    ],
    "totalAmount": 500,
    "paymentStatus": "paid",
    "placedAt": "2023-05-11T00:00:00.000Z",
    "invoiceNumber": "INV-12345"
  }
}
```

### Get All Orders

**Endpoint:** `GET /orders`

**Description:** Get all orders (admin or server).

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Query Parameters:**

- `status` (optional): Filter by order status
- `page` (optional): Page number for pagination
- `limit` (optional): Items per page

**Response:**

```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "_id": "order_id",
        "user": {
          "_id": "user_id",
          "name": "John Doe"
        },
        "items": [
          {
            "menuItem": {
              "_id": "item_id",
              "name": "Butter Chicken"
            },
            "quantity": 2,
            "subtotal": 500
          }
        ],
        "status": "delivered",
        "tableNumber": 5,
        "totalAmount": 500,
        "placedAt": "2023-05-11T00:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "pages": 5
    }
  }
}
```

### Update Payment Status

**Endpoint:** `PUT /orders/:orderId/payment-status`

**Description:** Update the payment status of an order.

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "paymentStatus": "paid",
  "paymentMethod": "cash"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "order_id",
    "paymentStatus": "paid",
    "paymentMethod": "cash",
    "updatedAt": "2023-05-11T00:00:00.000Z"
  }
}
```

---

## Group Management

Endpoints for managing user groups.

### Create Group

**Endpoint:** `POST /groups`

**Description:** Create a new group for shared orders.

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "name": "Lunch Buddies",
  "members": ["user_id1", "user_id2"]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "group_id",
    "name": "Lunch Buddies",
    "creator": "user_id",
    "members": ["user_id", "user_id1", "user_id2"],
    "active": true,
    "createdAt": "2023-05-11T00:00:00.000Z"
  }
}
```

### Get User Groups

**Endpoint:** `GET /groups`

**Description:** Get all groups that a user is a member of.

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "group_id",
      "name": "Lunch Buddies",
      "creator": {
        "_id": "user_id",
        "name": "John Doe"
      },
      "members": [
        {
          "_id": "user_id",
          "name": "John Doe"
        },
        {
          "_id": "user_id1",
          "name": "Jane Smith"
        }
      ],
      "active": true,
      "createdAt": "2023-05-11T00:00:00.000Z"
    }
  ]
}
```

### Add Members to Group

**Endpoint:** `PUT /groups/:groupId/members`

**Description:** Add members to an existing group.

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "members": ["user_id3", "user_id4"]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "group_id",
    "members": ["user_id", "user_id1", "user_id2", "user_id3", "user_id4"]
  }
}
```

### Remove Member from Group

**Endpoint:** `DELETE /groups/:groupId/members/:userId`

**Description:** Remove a member from a group.

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Response:**

```json
{
  "success": true,
  "message": "Member removed from group"
}
```

### Disband Group

**Endpoint:** `DELETE /groups/:groupId`

**Description:** Disband a group (creator only).

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Response:**

```json
{
  "success": true,
  "message": "Group disbanded successfully"
}
```

---

## Rating System

Endpoints for managing ratings and feedback.

### Rate Server

**Endpoint:** `POST /ratings/server/:serverId`

**Description:** Rate a server's performance.

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "rating": 4.5,
  "comment": "Very polite and efficient service",
  "orderId": "order_id"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "rating_id",
    "user": "user_id",
    "server": "server_id",
    "rating": 4.5,
    "comment": "Very polite and efficient service",
    "order": "order_id",
    "createdAt": "2023-05-11T00:00:00.000Z"
  }
}
```

### Get Server Ratings

**Endpoint:** `GET /ratings/server/:serverId`

**Description:** Get all ratings for a specific server.

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Response:**

```json
{
  "success": true,
  "data": {
    "averageRating": 4.7,
    "totalRatings": 15,
    "ratings": [
      {
        "_id": "rating_id",
        "user": {
          "_id": "user_id",
          "name": "John Doe"
        },
        "rating": 4.5,
        "comment": "Very polite and efficient service",
        "createdAt": "2023-05-11T00:00:00.000Z"
      }
    ]
  }
}
```

### Rate Food

**Endpoint:** `POST /ratings/item/:menuItemId`

**Description:** Rate a menu item.

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "rating": 5,
  "comment": "Delicious food, highly recommended",
  "orderId": "order_id"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "rating_id",
    "user": "user_id",
    "menuItem": "menu_item_id",
    "rating": 5,
    "comment": "Delicious food, highly recommended",
    "order": "order_id",
    "createdAt": "2023-05-11T00:00:00.000Z"
  }
}
```

### Get Item Ratings

**Endpoint:** `GET /ratings/item/:menuItemId`

**Description:** Get all ratings for a specific menu item.

**Response:**

```json
{
  "success": true,
  "data": {
    "averageRating": 4.8,
    "totalRatings": 25,
    "ratings": [
      {
        "_id": "rating_id",
        "user": {
          "_id": "user_id",
          "name": "John Doe"
        },
        "rating": 5,
        "comment": "Delicious food, highly recommended",
        "createdAt": "2023-05-11T00:00:00.000Z"
      }
    ]
  }
}
```

---

## Server Management

Endpoints for managing restaurant servers.

### Get All Servers (Admin Only)

**Endpoint:** `GET /admin/servers`

**Description:** Get all servers.

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "server_id",
      "user": {
        "_id": "user_id",
        "name": "John Server",
        "email": "john.server@example.com"
      },
      "startDate": "2023-01-15T00:00:00.000Z",
      "active": true,
      "averageRating": 4.7
    }
  ]
}
```

### Update Server Status (Admin Only)

**Endpoint:** `PUT /admin/servers/:serverId/status`

**Description:** Update a server's active status.

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "active": false
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "server_id",
    "active": false,
    "updatedAt": "2023-05-11T00:00:00.000Z"
  }
}
```

### Assign Order to Server (Admin Only)

**Endpoint:** `PUT /admin/servers/:serverId/assign-order/:orderId`

**Description:** Assign an order to a specific server.

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Response:**

```json
{
  "success": true,
  "data": {
    "order": {
      "_id": "order_id",
      "assignedServer": "server_id",
      "status": "assigned"
    }
  }
}
```

---

## Admin Dashboard

Endpoints for the admin dashboard.

### Get Admin Summary

**Endpoint:** `GET /admin/summary`

**Description:** Get summary information for the admin dashboard.

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Response:**

```json
{
  "success": true,
  "data": {
    "totalUsers": 500,
    "totalOrders": 1200,
    "totalRevenue": 150000,
    "activeServers": 10,
    "activeStudents": 450,
    "popularItems": [
      {
        "_id": "item_id",
        "name": "Butter Chicken",
        "orderCount": 250
      }
    ],
    "recentOrders": [
      {
        "_id": "order_id",
        "user": {
          "name": "John Doe"
        },
        "totalAmount": 500,
        "status": "delivered",
        "placedAt": "2023-05-11T00:00:00.000Z"
      }
    ]
  }
}
```

---

## Analytics

Endpoints for analytics data.

### Get Total Orders Today (Admin Only)

**Endpoint:** `GET /admin/analytics/orders-today`

**Description:** Get the total number of orders placed today.

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Response:**

```json
{
  "success": true,
  "data": {
    "count": 45,
    "totalRevenue": 22500
  }
}
```

### Get Top Items (Admin Only)

**Endpoint:** `GET /admin/analytics/top-items`

**Description:** Get the most popular menu items.

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Query Parameters:**

- `limit` (optional): Number of items to return (default: 5)
- `period` (optional): Time period (day, week, month, year) (default: week)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "item_id",
      "name": "Butter Chicken",
      "orderCount": 250,
      "totalRevenue": 62500
    }
  ]
}
```

### Get Top Rated Servers (Admin Only)

**Endpoint:** `GET /admin/analytics/top-servers`

**Description:** Get the highest-rated servers.

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Query Parameters:**

- `limit` (optional): Number of servers to return (default: 5)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "server_id",
      "user": {
        "name": "John Server"
      },
      "averageRating": 4.9,
      "totalRatings": 150
    }
  ]
}
```

---

## File Upload

Endpoints for file uploads.

### Upload File

**Endpoint:** `POST /upload`

**Description:** Upload a file (image).

**Headers:**

```
Authorization: Bearer jwt_token_here
Content-Type: multipart/form-data
```

**Request Body:**

```
file: [File Object]
```

**Response:**

```json
{
  "success": true,
  "data": {
    "fileName": "1746771853017.jpg",
    "filePath": "/uploads/1746771853017.jpg",
    "fileUrl": "http://localhost:5000/uploads/1746771853017.jpg"
  }
}
```

---

## Error Responses

All API endpoints return a standardized error response format:

```json
{
  "success": false,
  "error": {
    "message": "Error message here",
    "code": "ERROR_CODE"
  }
}
```

Common HTTP status codes:

- `200 OK`: Request succeeded
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: Authenticated user doesn't have permission
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server-side error

---

## Authentication

Most endpoints require authentication using a JWT token provided in the Authorization header:

```
Authorization: Bearer your_jwt_token_here
```

---

## Rate Limiting

API requests are subject to rate limiting to prevent abuse. If you exceed the rate limit, you'll receive a 429 Too Many Requests status code.

---

## Websocket Connections

Real-time features like order updates and chat use WebSockets.

### Connection URL

```
ws://localhost:5000
```

### Authentication

Pass the JWT token as a query parameter:

```
ws://localhost:5000?token=your_jwt_token_here
```

### Events

- `order_status_update`: Emitted when an order's status changes
- `new_message`: Emitted when a new chat message is received
- `payment_status_update`: Emitted when a payment status changes

---

## Need Help?

For any questions or support, please contact the Smart-Dhaba development team.
