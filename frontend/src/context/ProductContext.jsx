import { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { SocketContext } from './SocketContext';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const PRODUCT_API = import.meta.env.VITE_PRODUCT_API;
  const { socket } = useContext(SocketContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${PRODUCT_API}/getAll`);
      setProducts(data);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch products');
      setLoading(false);
      toast.error(error.response?.data?.message || 'Failed to fetch products');
    }
  };

  // Fetch product by ID
  const fetchProductById = async (productId) => {
    try {
      const { data } = await axios.get(`${PRODUCT_API}/get/${productId}`);
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch product');
      return null;
    }
  };

  // Create product
  const createProduct = async (productData) => {
    try {
      const { data } = await axios.post(`${PRODUCT_API}/create`, productData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Note: We don't need to update the products state here anymore
      // as it will be handled by the socket event
      toast.success(data.message);
      return data.product;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create product');
      return null;
    }
  };

  // Update product
  const updateProduct = async (productId, productData) => {
    try {
      const { data } = await axios.put(
        `${PRODUCT_API}/update/${productId}`,
        productData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Note: We don't need to update the products state here anymore
      // as it will be handled by the socket event
      toast.success(data.message);
      return data.product;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update product');
      return null;
    }
  };

  // Delete product
  const deleteProduct = async (productId) => {
    try {
      const { data } = await axios.delete(
        `${PRODUCT_API}/delete/${productId}`,
        {
          withCredentials: true,
        }
      );

      // Note: We don't need to update the products state here anymore
      // as it will be handled by the socket event
      toast.success(data.message);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete product');
      return false;
    }
  };

  // Fetch products by user ID
  const fetchProductsByUserId = async (userId) => {
    try {
      const { data } = await axios.get(`${PRODUCT_API}/getByUserId/${userId}`, {
        withCredentials: true,
      });
      return data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to fetch user products'
      );
      return [];
    }
  };

  // Set up socket event listeners for real-time updates
  useEffect(() => {
    if (!socket) return;

    // Listen for product created event
    socket.on('product:created', (newProduct) => {
      setProducts((prevProducts) => {
        // Check if product already exists to avoid duplicates
        if (
          Array.isArray(prevProducts) &&
          !prevProducts.some((p) => p._id === newProduct._id)
        ) {
          return [...prevProducts, newProduct];
        }
        return prevProducts;
      });
      toast.info(`New product added: ${newProduct.productName}`);
    });

    // Listen for product updated event
    socket.on('product:updated', (updatedProduct) => {
      setProducts((prevProducts) => {
        if (Array.isArray(prevProducts)) {
          return prevProducts.map((product) =>
            product._id === updatedProduct._id ? updatedProduct : product
          );
        }
        return prevProducts;
      });
    });

    // Listen for product deleted event
    socket.on('product:deleted', (deletedProductId) => {
      setProducts((prevProducts) => {
        if (Array.isArray(prevProducts)) {
          return prevProducts.filter(
            (product) => product._id !== deletedProductId
          );
        }
        return prevProducts;
      });
    });

    // Cleanup function
    return () => {
      socket.off('product:created');
      socket.off('product:updated');
      socket.off('product:deleted');
    };
  }, [socket]);

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        fetchProducts,
        fetchProductById,
        createProduct,
        updateProduct,
        deleteProduct,
        fetchProductsByUserId,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
