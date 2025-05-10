import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { ProductContext } from '../context/ProductContext';
import { SocketContext } from '../context/SocketContext';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Cart() {
  const { user, loggedIn } = useContext(UserContext);
  const { fetchProductById } = useContext(ProductContext);
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const PRODUCT_API = import.meta.env.VITE_PRODUCT_API;
  const USER_API = import.meta.env.VITE_USER_API;

  // Redirect if not logged in
  useEffect(() => {
    if (!loggedIn && !loading) {
      navigate('/login');
    }
  }, [loggedIn, loading, navigate]);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!user || !user.cartProduct || user.cartProduct.length === 0) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      try {
        const productPromises = user.cartProduct.map(async (productId) => {
          const product = await fetchProductById(productId);
          return product;
        });

        const products = await Promise.all(productPromises);
        setCartItems(products.filter(Boolean)); // Filter out any null values

        // Initialize quantities
        const initialQuantities = {};
        products.forEach((product) => {
          if (product && product._id) {
            initialQuantities[product._id] = 1;
          }
        });
        setQuantities(initialQuantities);

        // Calculate total
        calculateTotal(products.filter(Boolean), initialQuantities);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        toast.error('Failed to load cart items');
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [user, fetchProductById]);

  // Set up socket event listeners for real-time cart updates
  useEffect(() => {
    if (!socket || !user) return;

    // Listen for cart:added event
    socket.on('cart:added', async (data) => {
      if (data.userId === user._id) {
        // Fetch the product that was added
        const newProduct = await fetchProductById(data.productId);
        if (newProduct) {
          // Check if product is already in cart to avoid duplicates
          if (!cartItems.some((item) => item._id === newProduct._id)) {
            setCartItems((prev) => [...prev, newProduct]);

            // Update quantities
            setQuantities((prev) => ({
              ...prev,
              [newProduct._id]: 1,
            }));

            // Recalculate total
            calculateTotal([...cartItems, newProduct], {
              ...quantities,
              [newProduct._id]: 1,
            });

            toast.success('Product added to cart');
          }
        }
      }
    });

    // Listen for cart:removed event
    socket.on('cart:removed', (data) => {
      if (data.userId === user._id) {
        // Update cart items
        const updatedItems = cartItems.filter(
          (item) => item._id !== data.productId
        );
        setCartItems(updatedItems);

        // Update quantities
        const updatedQuantities = { ...quantities };
        delete updatedQuantities[data.productId];
        setQuantities(updatedQuantities);

        // Recalculate total
        calculateTotal(updatedItems, updatedQuantities);
      }
    });

    return () => {
      socket.off('cart:added');
      socket.off('cart:removed');
    };
  }, [socket, user, cartItems, quantities, fetchProductById]);

  const calculateTotal = (items, itemQuantities) => {
    const sum = items.reduce((acc, product) => {
      const quantity = itemQuantities[product._id] || 1;
      return acc + parseFloat(product.productPrice || 0) * quantity;
    }, 0);
    setTotal(sum);
  };

  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`${USER_API}/cart/remove/${productId}`, {
        withCredentials: true,
      });

      // Update local state
      const updatedItems = cartItems.filter((item) => item._id !== productId);
      setCartItems(updatedItems);

      // Update quantities
      const updatedQuantities = { ...quantities };
      delete updatedQuantities[productId];
      setQuantities(updatedQuantities);

      // Recalculate total
      calculateTotal(updatedItems, updatedQuantities);

      toast.success('Product removed from cart');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove product from cart');
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedQuantities = {
      ...quantities,
      [productId]: newQuantity,
    };

    setQuantities(updatedQuantities);
    calculateTotal(cartItems, updatedQuantities);
  };

  const handleCheckout = () => {
    setCheckoutLoading(true);

    // Simulate checkout process
    setTimeout(() => {
      toast.success('Order placed successfully!');
      setCheckoutLoading(false);
      // In a real application, you would make an API call to create an order
      // and then clear the cart
      setCartItems([]);
      setQuantities({});
      setTotal(0);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-xl text-gray-600">Loading cart items...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center min-h-[60vh]">
        <div className="text-xl text-gray-600 mb-4">
          Please log in to view your cart
        </div>
        <Link to="/login">
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition duration-300">
            Login
          </button>
        </Link>
      </div>
    );
  }

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center min-h-[60vh]">
        <div className="text-xl text-gray-600 mb-4">Your cart is empty</div>
        <Link to="/">
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition duration-300">
            Continue Shopping
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Your Shopping Cart
      </h1>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex flex-col md:flex-row justify-between items-center border-b pb-4 mb-4"
            >
              <div className="flex flex-col md:flex-row items-center mb-4 md:mb-0">
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="w-24 h-24 object-cover rounded-md mr-6"
                />
                <div>
                  <h3 className="text-lg font-semibold">{item.productName}</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {item.productDescripation?.substring(0, 100)}...
                  </p>
                  <p className="text-indigo-600 font-medium mt-2">
                    ${parseFloat(item.productPrice).toFixed(2)} each
                  </p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center">
                <div className="flex items-center border border-gray-300 rounded-md mr-4 mb-4 md:mb-0">
                  <button
                    onClick={() =>
                      updateQuantity(item._id, quantities[item._id] - 1)
                    }
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 border-x border-gray-300">
                    {quantities[item._id] || 1}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item._id, quantities[item._id] + 1)
                    }
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <div className="text-xl font-bold text-indigo-600 mr-4">
                  $
                  {(
                    (parseFloat(item.productPrice) || 0) *
                    (quantities[item._id] || 1)
                  ).toFixed(2)}
                </div>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Subtotal:</span>
            <span className="text-xl font-bold text-indigo-600">
              ${total.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <Link to="/">
              <button className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition duration-300">
                Continue Shopping
              </button>
            </Link>
            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className={`bg-indigo-600 text-white px-6 py-3 rounded-md ${
                checkoutLoading
                  ? 'opacity-70 cursor-not-allowed'
                  : 'hover:bg-indigo-700 transition duration-300'
              }`}
            >
              {checkoutLoading ? 'Processing...' : 'Proceed to Checkout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
