import productModels from '../models/product.models.js';

export const createProduct = async (req, res) => {
  try {
    const { productName, productDescripation, productPrice } = req.body;

    if (!productName || !productDescripation || !productPrice) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Product image is required' });
    }

    const createdBy = req.user.id;
    const productImage = req.file.path;

    const newProduct = new productModels({
      productName,
      productDescripation,
      productPrice,
      createdBy,
      productImage,
    });

    await newProduct.save();
    res.status(201).json({
      message: 'Product created successfully',
      product: newProduct,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { productName, productDescripation, productPrice } = req.body;

    const { productId } = req.params;

    const updateProduct = await productModels.findByIdAndUpdate(
      productId,
      {
        productName,
        productDescripation,
        productPrice,
        productImage: req.file?.path,
      },
      { new: true }
    );

    await updateProduct.save();
    res.status(201).json({
      message: 'Product Update successfully',
      product: updateProduct,
    });
  } catch (error) {
    console.error('Error update product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const deleteProduct = await productModels.findByIdAndDelete(productId);

    if (!deleteProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({
      message: 'Product deleted successfully',
      product: deleteProduct,
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await productModels.find().populate('createdBy');
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await productModels
      .findById(productId)
      .populate('createdBy');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getProductByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const products = await productModels
      .find({ createdBy: userId })
      .populate('createdBy');

    if (!products) {
      return res.status(404).json({ message: 'Products not found' });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
