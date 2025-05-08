import React from "react";

export default function Shop() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="card bg-white w-96 rounded-3xl shadow-xl overflow-hidden transition-transform hover:scale-105">
        <figure className="relative">
          <img
            className="w-full h-56 object-cover"
            src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
            alt="Shoes"
          />
          <span className="absolute top-4 left-4 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full shadow">
            New
          </span>
        </figure>
        <div className="card-body p-6">
          <h2 className="card-title text-2xl font-bold text-gray-800 mb-2">
            Modern Sneakers
          </h2>
          <p className="text-gray-500 mb-4">
            Step up your style with these trendy sneakers. Perfect for any
            occasion and comfortable all day long.
          </p>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xl font-semibold text-indigo-600">
              $89.99
            </span>
            <span className="text-sm text-gray-400 line-through">$119.99</span>
          </div>
          <div className="card-actions">
            <button className="btn btn-primary w-full bg-indigo-600 hover:bg-indigo-700 border-0 text-white font-semibold rounded-xl py-3 transition">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
