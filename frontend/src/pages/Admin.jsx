import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { ProductContext } from '../context/ProductContext';
import { SocketContext } from '../context/SocketContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function Admin() {
  const { user, Admin } = useContext(UserContext);
  const { products, deleteProduct } = useContext(ProductContext);
  const { socket } = useContext(SocketContext);

  const [email, setEmail] = useState('');
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const USER_API = import.meta.env.VITE_USER_API;

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      if (user?.isAdmin) {
        try {
          setLoading(true);
          // This endpoint would need to be implemented in the backend
          const { data } = await axios.get(`${USER_API}/all`, {
            withCredentials: true,
          });
          setUsers(data);
        } catch (error) {
          console.error('Error fetching users:', error);
          toast.error('Failed to fetch users');
        } finally {
          setLoading(false);
        }
      }
    };

    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab, user, USER_API]);

  // Set up socket event listeners for real-time admin updates
  useEffect(() => {
    if (!socket || !user?.isAdmin) return;

    // Listen for user admin updates
    socket.on('user:admin-updated', (updatedUser) => {
      // Update the users list if the user is already in the list
      setUsers((prevUsers) => {
        if (!Array.isArray(prevUsers)) return prevUsers;

        return prevUsers.map((user) => {
          if (
            user._id === updatedUser.userId ||
            user.email === updatedUser.email
          ) {
            return { ...user, isAdmin: true };
          }
          return user;
        });
      });

      toast.info(`User ${updatedUser.email} has been promoted to admin`);
    });

    // Cleanup function
    return () => {
      socket.off('user:admin-updated');
    };
  }, [socket, user]);

  const handlePromoteToAdmin = async () => {
    if (!email.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    try {
      await Admin(email);
      setEmail('');
      // Refresh user list
      const { data } = await axios.get(`${USER_API}/all`, {
        withCredentials: true,
      });
      setUsers(data);
    } catch (error) {
      console.error('Error promoting user to admin:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(productId);
    }
  };

  // Filter products based on search term
  const filteredProducts = Array.isArray(products)
    ? products.filter((product) =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Filter users based on search term
  const filteredUsers = Array.isArray(users)
    ? users.filter(
        (user) =>
          user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Check if user is admin
  if (!user || !user.isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You do not have permission to access the admin panel.
        </p>
        <Link to="/">
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition duration-300">
            Return to Home
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">
        Admin Dashboard
      </h1>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-3 px-6 font-medium ${
            activeTab === 'users'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-indigo-500'
          }`}
          onClick={() => setActiveTab('users')}
        >
          Manage Users
        </button>
        <button
          className={`py-3 px-6 font-medium ${
            activeTab === 'products'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-indigo-500'
          }`}
          onClick={() => setActiveTab('products')}
        >
          Manage Products
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder={`Search ${
            activeTab === 'users' ? 'users' : 'products'
          }...`}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Users Tab Content */}
      {activeTab === 'users' && (
        <div>
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              Promote User to Admin
            </h2>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter user email"
                className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handlePromoteToAdmin}
                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-300"
              >
                Promote to Admin
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-md">
              <p className="text-gray-600">No users found.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={
                                user.profileImage ||
                                'https://via.placeholder.com/40'
                              }
                              alt={user.fullName}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.fullName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.isAdmin
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {user.isAdmin ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Products Tab Content */}
      {activeTab === 'products' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">All Products</h2>
            <Link to="/create-product">
              <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-300">
                Add New Product
              </button>
            </Link>
          </div>

          {!Array.isArray(products) || products.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-md">
              <p className="text-gray-600 mb-4">No products found.</p>
              <Link to="/create-product">
                <button className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-300">
                  Create First Product
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <img
                    src={product.productImage}
                    alt={product.productName}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {product.productName}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {product.productDescripation}
                    </p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-lg font-bold text-indigo-600">
                        ${parseFloat(product.productPrice).toFixed(2)}
                      </span>
                      <div className="flex space-x-2">
                        <Link to={`/update-product/${product._id}`}>
                          <button className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700 transition-colors duration-300">
                            Edit
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors duration-300"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
