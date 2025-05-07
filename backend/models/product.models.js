import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    productDescripation: {
      type: String,
      required: true,
    },
    productImage: {
      type: String,
      required: true,
    },
    productPrice: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const productModels = mongoose.model('Product', productSchema);

export default productModels;
