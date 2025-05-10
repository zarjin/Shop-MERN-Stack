import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongodbConnect from './config/mongodb.connect.js';
import userRouter from './routes/user.routes.js';
import productRouter from './routes/product.routes.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Join a room for all users
  socket.join('all-users');

  // Product events
  socket.on('product:create', (product) => {
    io.emit('product:created', product);
  });

  socket.on('product:update', (product) => {
    io.emit('product:updated', product);
  });

  socket.on('product:delete', (productId) => {
    io.emit('product:deleted', productId);
  });

  // Cart events
  socket.on('cart:add', (data) => {
    // Emit to specific user if userId is provided
    if (data.userId) {
      io.to(data.userId).emit('cart:added', data.product);
    }
  });

  socket.on('cart:remove', (data) => {
    if (data.userId) {
      io.to(data.userId).emit('cart:removed', data.productId);
    }
  });

  // User events
  socket.on('user:admin', (user) => {
    io.emit('user:admin-updated', user);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io accessible to our routes
app.set('io', io);

mongodbConnect();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/user', userRouter);
app.use('/api/product', productRouter);

const PORT = process.env.PORT;

httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
