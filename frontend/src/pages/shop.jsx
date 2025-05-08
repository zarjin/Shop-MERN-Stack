import React from "react";
import { MdOutlineShoppingCart } from "react-icons/md";
import { FcLikePlaceholder } from "react-icons/fc";

export default function Shop() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 py-10">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-10 tracking-tight">
          Shop
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-5xl">
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center transition-transform hover:-translate-y-2 hover:shadow-2xl">
            <img
              src="https://via.placeholder.com/150"
              alt="Product 1"
              className="w-36 h-36 object-cover rounded-xl mb-4"
            />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Product 1
            </h2>
            <p className="text-lg text-blue-600 font-bold mb-4">$10.00</p>
            <div className="flex gap-3 w-full">
              <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                <MdOutlineShoppingCart size={22} />
                Add to Cart
              </button>
              <button className="flex items-center justify-center gap-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-pink-100 transition">
                <FcLikePlaceholder size={22} />
                Fav
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
