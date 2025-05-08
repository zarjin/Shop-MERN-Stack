import React, { useState } from "react";
import { Link } from "react-router";
import { CiShop, CiShoppingCart, CiUser, CiLogin } from "react-icons/ci";

export default function Navbar() {
  const [isLogin, setIsLogin] = useState(false);
  return (
    <div className="w-full h-16 bg-gradient-to-r from-blue-700 to-blue-500 text-white flex items-center justify-between px-8 shadow-md">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <span className="text-3xl font-bold tracking-wide">SHOP</span>
      </div>

      {/* Navigation */}
      <nav className="flex items-center space-x-6">
        <Link
          to="/shop"
          className="flex items-center space-x-1 hover:text-blue-200 transition"
        >
          <CiShop size={28} />
          <span className="hidden md:inline">Shop</span>
        </Link>
      </nav>

      {/* Auth Buttons */}
      <div className="flex items-center space-x-3">
        {isLogin ? (
          <>
            {" "}
            <Link
              to="/cart"
              className="flex items-center space-x-1 hover:text-blue-200 transition relative"
            >
              <CiShoppingCart size={28} />
              <span className="hidden md:inline">Cart</span>
              {/* Example cart badge */}
              <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full px-1.5 py-0.5 font-bold">
                2
              </span>
            </Link>
            <Link
              to="/profile"
              className="flex items-center space-x-1 hover:text-blue-200 transition"
            >
              <CiUser size={28} />
              <span className="hidden md:inline">Profile</span>
            </Link>
          </>
        ) : (
          <Link to="/login">
            <button className="flex items-center px-4 py-1.5 bg-white text-blue-600 font-semibold rounded hover:bg-blue-100 transition">
              <CiLogin className="mr-1" size={28} />
              Login
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}
