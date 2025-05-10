import { useState, useContext } from 'react';
import { ProductContext } from '../context/ProductContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function CreateProduct() {
  const { createProduct } = useContext(ProductContext);
  const navigate = useNavigate();

  const [productName, setProductName] = useState('');
  const [productDescripation, setProductDescripation] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!productName.trim()) {
      newErrors.productName = 'Product name is required';
    }

    if (!productDescripation.trim()) {
      newErrors.productDescripation = 'Product description is required';
    } else if (productDescripation.trim().length < 10) {
      newErrors.productDescripation =
        'Description should be at least 10 characters';
    }

    if (!productPrice) {
      newErrors.productPrice = 'Product price is required';
    } else if (isNaN(productPrice) || parseFloat(productPrice) <= 0) {
      newErrors.productPrice = 'Price must be a positive number';
    }

    if (!productImage) {
      newErrors.productImage = 'Product image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('productName', productName);
    formData.append('productDescripation', productDescripation);
    formData.append('productPrice', productPrice);
    formData.append('productImage', productImage);

    try {
      const result = await createProduct(formData);
      if (result) {
        toast.success('Product created successfully');
        navigate('/');
      }
    } catch (error) {
      toast.error('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-indigo-600">
          Create New Product
        </h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-full"
          encType="multipart/form-data"
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="productName"
            >
              Product Name
            </label>
            <input
              type="text"
              id="productName"
              name="productName"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.productName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter product name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
            {errors.productName && (
              <p className="text-red-500 text-sm mt-1">{errors.productName}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="productDescripation"
            >
              Product Description
            </label>
            <textarea
              id="productDescripation"
              name="productDescripation"
              rows="4"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.productDescripation
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
              placeholder="Enter product description"
              value={productDescripation}
              onChange={(e) => setProductDescripation(e.target.value)}
            ></textarea>
            {errors.productDescripation && (
              <p className="text-red-500 text-sm mt-1">
                {errors.productDescripation}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="productPrice"
            >
              Product Price ($)
            </label>
            <input
              type="number"
              id="productPrice"
              name="productPrice"
              step="0.01"
              min="0"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.productPrice ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter product price"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
            />
            {errors.productPrice && (
              <p className="text-red-500 text-sm mt-1">{errors.productPrice}</p>
            )}
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="productImage"
            >
              Product Image
            </label>
            <input
              type="file"
              id="productImage"
              name="productImage"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.productImage ? 'border-red-500' : 'border-gray-300'
              }`}
              accept="image/*"
              onChange={(e) => setProductImage(e.target.files[0])}
            />
            {errors.productImage && (
              <p className="text-red-500 text-sm mt-1">{errors.productImage}</p>
            )}
            {productImage && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  Selected: {productImage.name}
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-medium ${
              loading
                ? 'opacity-70 cursor-not-allowed'
                : 'hover:bg-indigo-700 transition-colors duration-300'
            }`}
          >
            {loading ? 'Creating Product...' : 'Create Product'}
          </button>
        </form>
      </div>
    </div>
  );
}
