# Shop-MERN-Stack

A full-featured e-commerce application built with the MERN stack (MongoDB, Express, React, Node.js) featuring real-time updates with Socket.IO.

![MERN Shop](https://via.placeholder.com/800x400?text=MERN+Shop)

## Features

- **User Authentication**: Register, login, and profile management
- **Product Management**: Create, update, and delete products
- **Shopping Cart**: Add and remove products from cart
- **Admin Panel**: User management and admin privileges
- **Real-time Updates**: Instant product and cart updates using Socket.IO
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS
- **Image Upload**: Cloud storage for product and profile images using Cloudinary
- **Secure API**: JWT-based authentication and protected routes

## Tech Stack

### Frontend
- React 19
- React Router v7
- Tailwind CSS
- DaisyUI
- Socket.IO Client
- Axios
- React Toastify
- Vite

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- Socket.IO
- JWT Authentication
- Bcrypt.js
- Multer
- Cloudinary

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas)

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Frontend (.env)
```
VITE_USER_API=http://localhost:5000/api/user
VITE_PRODUCT_API=http://localhost:5000/api/product
VITE_SOCKET_URL=http://localhost:5000
```

## Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/Shop-MERN-Stack.git
cd Shop-MERN-Stack
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

## Running the Application

### Development Mode

1. Start the backend server
```bash
cd backend
npm run dev
```

2. Start the frontend development server
```bash
cd frontend
npm run dev
```

The frontend will be available at http://localhost:5173 and the backend at http://localhost:5000.

## Project Structure

```
Shop-MERN-Stack/
├── backend/
│   ├── config/
│   │   ├── cloudinary.config.js
│   │   └── mongodb.connect.js
│   ├── controllers/
│   │   ├── product.controller.js
│   │   └── user.controller.js
│   ├── middlewares/
│   │   ├── isAuthentication.middleware.js
│   │   └── upload.middleware.js
│   ├── models/
│   │   ├── product.models.js
│   │   └── user.models.js
│   ├── routes/
│   │   ├── product.routes.js
│   │   └── user.routes.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   │   ├── ProductContext.jsx
│   │   │   ├── SocketContext.jsx
│   │   │   └── UserContext.jsx
│   │   ├── pages/
│   │   │   ├── Admin.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── CreateProduct.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Shop.jsx
│   │   │   └── ProductUpdate.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## API Endpoints

### User Routes
- `POST /api/user/register` - Register a new user
- `POST /api/user/login` - Login user
- `GET /api/user/logout` - Logout user
- `GET /api/user/checkAuthentication` - Check if user is authenticated
- `GET /api/user/me` - Get current user data
- `POST /api/user/cart/add/:productId` - Add product to cart
- `DELETE /api/user/cart/remove/:productId` - Remove product from cart
- `POST /api/user/favorites/add/:productId` - Add product to favorites
- `DELETE /api/user/favorites/remove/:productId` - Remove product from favorites
- `POST /api/user/admin` - Promote user to admin
- `GET /api/user/all` - Get all users (admin only)

### Product Routes
- `POST /api/product/create` - Create a new product
- `PUT /api/product/update/:productId` - Update a product
- `DELETE /api/product/delete/:productId` - Delete a product
- `GET /api/product/get/:productId` - Get a product by ID
- `GET /api/product/getAll` - Get all products
- `GET /api/product/getByUserId/:userId` - Get products by user ID

## Socket.IO Events

### Server Events (Emitted)
- `product:created` - When a new product is created
- `product:updated` - When a product is updated
- `product:deleted` - When a product is deleted
- `cart:added` - When a product is added to cart
- `cart:removed` - When a product is removed from cart
- `user:admin-updated` - When a user is promoted to admin

### Client Events (Listened)
- `product:create` - Create a new product
- `product:update` - Update a product
- `product:delete` - Delete a product
- `cart:add` - Add a product to cart
- `cart:remove` - Remove a product from cart
- `user:admin` - Promote a user to admin

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Acknowledgements

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Socket.IO](https://socket.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [DaisyUI](https://daisyui.com/)
- [Cloudinary](https://cloudinary.com/)
