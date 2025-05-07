import express from 'express';
import {
  register,
  login,
  logout,
  checkAuthentication,
  getUser,
  addCart,
  removeCart,
  addFovProduct,
  removeFovProduct,
  isAdmin,
} from '../controllers/user.controller.js';
import isAuthenticated from '../middlewares/isAuthentication.middleware.js';
import { profileStorage } from '../middlewares/upload.middleware.js';

const userRouter = express.Router();

// ✅ Auth Routes
userRouter.post('/register', profileStorage.single('profileImage'), register);
userRouter.post('/login', login);
userRouter.get('/logout', isAuthenticated, logout);
userRouter.get('/checkAuthentication', isAuthenticated, checkAuthentication);
userRouter.get('/me', isAuthenticated, getUser);

// ✅ Cart Routes
userRouter.post('/cart/add/:productId', isAuthenticated, addCart);
userRouter.delete('/cart/remove/:productId', isAuthenticated, removeCart);

// ✅ Favorite Product Routes
userRouter.post('/favorites/add/:productId', isAuthenticated, addFovProduct);
userRouter.delete(
  '/favorites/remove/:productId',
  isAuthenticated,
  removeFovProduct
);

// ✅ Admin Check Route
userRouter.get('/admin', isAuthenticated, isAdmin);

export default userRouter;
