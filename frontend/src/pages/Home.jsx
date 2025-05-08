import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-xl p-10 flex flex-col items-center space-y-6">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-2 text-center drop-shadow">
          Welcome To My MERN Shop
        </h1>
        <p className="text-gray-600 text-lg text-center max-w-md">
          Discover the latest products and enjoy a seamless shopping experience.
        </p>
        <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 transition-colors font-semibold text-white rounded-lg shadow-md text-lg">
          Shop Now
        </button>
      </div>
    </div>
  );
}
