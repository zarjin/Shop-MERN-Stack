import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import mongodbConnect from './config/mongodb.connect.js';
import userRouter from './routes/user.routes.js';
import productRouter from './routes/product.routes.js';

const app = express();
mongodbConnect();
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/user', userRouter);
app.use('/api/product', productRouter);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server is open http://localhost:${PORT}`);
});
