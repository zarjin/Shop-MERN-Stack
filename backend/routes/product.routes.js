import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getAllProducts,
  getProductByUserId,
} from '../controllers/product.controller.js';

import isAuthenticated from '../middlewares/isAuthentication.middleware.js';

import { productPicStorage } from '../middlewares/upload.middleware.js';

import express from 'express';

const productRouter = express.Router();

productRouter.post(
  '/create',
  isAuthenticated,
  productPicStorage.single('productImage'),
  createProduct
);

productRouter.put(
  '/update/:productId',
  isAuthenticated,
  productPicStorage.single('productImage'),
  updateProduct
);

productRouter.delete('/delete/:productId', isAuthenticated, deleteProduct);

productRouter.get('/get/:productId', getProductById);

productRouter.get('/getAll', getAllProducts);

productRouter.get('/getByUserId/:userId', isAuthenticated, getProductByUserId);

export default productRouter;
