import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { ProductContext } from '../context/ProductContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Profile() {
  const { user } = useContext(UserContext);
  const { fetchProductsByUserId, deleteProduct } = useContext(ProductContext);
  const [userProducts, setUserProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    number: '',
    address: '',
  });

  useEffect(() => {
    const fetchUserProducts = async () => {
      if (user && user._id) {
        try {
          const products = await fetchProductsByUserId(user._id);
          setUserProducts(products);
        } catch (error) {
          console.error('Error fetching user products:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserProducts();
  }, [user, fetchProductsByUserId]);

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || '',
        email: user.email || '',
        number: user.number || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    // Profile update functionality would go here
    toast.info('Profile update functionality will be implemented soon');
    setIsEditing(false);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const success = await deleteProduct(productId);
      if (success) {
        setUserProducts(
          userProducts.filter((product) => product._id !== productId)
        );
      }
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-xl text-gray-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Profile Sidebar */}
          <div className="md:w-1/3 bg-indigo-600 p-8 text-center">
            <div className="mb-6">
              <img
                src={user.profileImage || 'https://via.placeholder.com/150'}
                alt={user.fullName}
                className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white"
              />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {user.fullName}
            </h2>
            <p className="text-indigo-200 mb-4">{user.email}</p>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white text-indigo-600 px-4 py-2 rounded-md font-medium hover:bg-indigo-100 transition-colors duration-300"
            >
              {isEditing ? 'Cancel Editing' : 'Edit Profile'}
            </button>
          </div>

          {/* Profile Content */}
          <div className="md:w-2/3 p-8">
            {isEditing ? (
              <form onSubmit={handleProfileUpdate}>
                <h3 className="text-xl font-bold mb-4 text-gray-800">
                  Edit Profile
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label
                      className="block text-gray-700 font-medium mb-2"
                      htmlFor="fullName"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={profileData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-gray-700 font-medium mb-2"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      disabled
                    />
                  </div>
                  <div>
                    <label
                      className="block text-gray-700 font-medium mb-2"
                      htmlFor="number"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="number"
                      name="number"
                      value={profileData.number}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-gray-700 font-medium mb-2"
                      htmlFor="address"
                    >
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={profileData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-6 py-2 rounded-md font-medium hover:bg-indigo-700 transition-colors duration-300"
                >
                  Save Changes
                </button>
              </form>
            ) : (
              <div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">
                  Profile Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-gray-600 text-sm">Full Name</p>
                    <p className="text-gray-800 font-medium">{user.fullName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Email</p>
                    <p className="text-gray-800 font-medium">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Phone Number</p>
                    <p className="text-gray-800 font-medium">
                      {user.number || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Address</p>
                    <p className="text-gray-800 font-medium">
                      {user.address || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* User Products Section */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Your Products
                </h3>
                <Link to="/create-product">
                  <button className="bg-green-500 text-white px-4 py-2 rounded-md font-medium hover:bg-green-600 transition-colors duration-300">
                    Add New Product
                  </button>
                </Link>
              </div>

              {loading ? (
                <p className="text-gray-600">Loading your products...</p>
              ) : !Array.isArray(userProducts) || userProducts.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-md">
                  <p className="text-gray-600 mb-4">
                    You haven't created any products yet.
                  </p>
                  <Link to="/create-product">
                    <button className="bg-indigo-600 text-white px-6 py-2 rounded-md font-medium hover:bg-indigo-700 transition-colors duration-300">
                      Create Your First Product
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userProducts.map((product) => (
                    <div
                      key={product._id}
                      className="border border-gray-200 rounded-md overflow-hidden flex"
                    >
                      <img
                        src={product.productImage}
                        alt={product.productName}
                        className="w-24 h-24 object-cover"
                      />
                      <div className="p-3 flex-grow">
                        <h4 className="font-semibold text-gray-800">
                          {product.productName}
                        </h4>
                        <p className="text-gray-600 text-sm mb-2">
                          ${parseFloat(product.productPrice).toFixed(2)}
                        </p>
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
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
