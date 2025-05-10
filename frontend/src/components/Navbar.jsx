import { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const { logoutUser, loggedIn, user } = useContext(UserContext);
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-700 shadow-xl">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center py-6">
          <Link
            to="/"
            className="text-3xl font-extrabold text-white hover:text-gray-200 transition duration-300 ease-in-out transform hover:scale-105"
          >
            ZwebDev
          </Link>
          {loggedIn ? (
            <div className="flex items-center space-x-6">
              <div className="relative">
                <button
                  onClick={() => setCartDropdownOpen(!cartDropdownOpen)}
                  className="text-white hover:text-gray-200 transition duration-300 ease-in-out transform hover:scale-110"
                >
                  <span className="h-7 w-7 flex items-center justify-center">
                    🛒
                  </span>
                  {user?.cartProduct?.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {user.cartProduct.length}
                    </span>
                  )}
                </button>
                {cartDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-lg shadow-2xl transition-all duration-300 ease-in-out transform origin-top scale-100">
                    <div className="p-4">
                      <p className="text-sm font-semibold text-gray-800">
                        {user?.cartProduct?.length || 0} Items in Cart
                      </p>
                      <p className="text-sm text-gray-600">Subtotal: $999</p>
                      <Link to="/cart">
                        <button className="mt-3 w-full bg-indigo-600 text-white rounded-md py-2 hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105">
                          View Cart
                        </button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-3 text-white hover:text-gray-200 transition duration-300 ease-in-out"
                >
                  <img
                    className="h-10 w-10 rounded-full object-cover border-2 border-white"
                    src={user?.profileImage || '/default-avatar.png'}
                    alt={user?.fullName}
                  />
                  <span className="font-medium">{user?.fullName}</span>
                </button>
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-lg shadow-2xl transition-all duration-300 ease-in-out transform origin-top scale-100">
                    <Link
                      to="/profile"
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition duration-200"
                    >
                      <span className="inline-block mr-2">👤</span> Profile
                    </Link>
                    <Link
                      to="/admin"
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition duration-200"
                    >
                      <span className="inline-block mr-2">⚙️</span> Admin Panel
                    </Link>
                    <button
                      onClick={() => logoutUser()}
                      className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition duration-200"
                    >
                      <span className="inline-block mr-2">🚪</span> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex space-x-4">
              <Link to="/login">
                <button className="bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold hover:bg-indigo-100 transition duration-300 ease-in-out transform hover:scale-105 shadow-md">
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="bg-transparent text-white border border-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:bg-opacity-10 transition duration-300 ease-in-out transform hover:scale-105 shadow-md">
                  Register
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
