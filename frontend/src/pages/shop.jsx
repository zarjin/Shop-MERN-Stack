import { useState, useContext, useEffect } from 'react';
import { ProductContext } from '../context/ProductContext';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Shop = () => {
  const { products, loading, error } = useContext(ProductContext);
  const { user, loggedIn } = useContext(UserContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('default');
  const USER_API = import.meta.env.VITE_USER_API;

  // Filter products based on search term and price filter
  const filteredProducts = Array.isArray(products)
    ? products.filter((product) => {
        // Search filter
        const matchesSearch = product.productName
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

        // Price filter
        let matchesPrice = true;
        if (priceFilter === 'under50') {
          matchesPrice = parseFloat(product.productPrice) < 50;
        } else if (priceFilter === '50to100') {
          matchesPrice =
            parseFloat(product.productPrice) >= 50 &&
            parseFloat(product.productPrice) <= 100;
        } else if (priceFilter === 'over100') {
          matchesPrice = parseFloat(product.productPrice) > 100;
        }

        return matchesSearch && matchesPrice;
      })
    : [];

  // Sort products
  const sortedProducts = Array.isArray(filteredProducts)
    ? [...filteredProducts].sort((a, b) => {
        if (sortOrder === 'priceLowToHigh') {
          return parseFloat(a.productPrice) - parseFloat(b.productPrice);
        } else if (sortOrder === 'priceHighToLow') {
          return parseFloat(b.productPrice) - parseFloat(a.productPrice);
        } else if (sortOrder === 'nameAZ') {
          return a.productName.localeCompare(b.productName);
        } else if (sortOrder === 'nameZA') {
          return b.productName.localeCompare(a.productName);
        }
        return 0;
      })
    : [];

  const addToCart = async (productId) => {
    if (!loggedIn) {
      toast.error('Please login to add products to cart');
      return;
    }

    try {
      const { data } = await axios.post(
        `${USER_API}/cart/add/${productId}`,
        {},
        {
          withCredentials: true,
        }
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-xl text-gray-600">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Our Shop</h1>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="w-full md:w-1/3">
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
            >
              <option value="all">All Prices</option>
              <option value="under50">Under $50</option>
              <option value="50to100">$50 - $100</option>
              <option value="over100">Over $100</option>
            </select>
          </div>

          <div className="w-full md:w-1/3">
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="default">Default Sorting</option>
              <option value="priceLowToHigh">Price: Low to High</option>
              <option value="priceHighToLow">Price: High to Low</option>
              <option value="nameAZ">Name: A to Z</option>
              <option value="nameZA">Name: Z to A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {!Array.isArray(sortedProducts) || sortedProducts.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl text-gray-600">No products found</h2>
          <p className="text-gray-500 mt-2">
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={product.productImage}
                  alt={product.productName}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">
                  {product.productName}
                </h2>
                <p className="text-gray-600 mb-2 text-sm line-clamp-2">
                  {product.productDescripation}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xl font-bold text-indigo-600">
                    ${parseFloat(product.productPrice).toFixed(2)}
                  </span>
                  <button
                    onClick={() => addToCart(product._id)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-300"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
