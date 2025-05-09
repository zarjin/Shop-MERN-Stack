import React from "react";
const Shop = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {" "}
      <h1 className="text-3xl font-bold mb-6">Our Shop</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {" "}
        {/* Product cards will be mapped here */}
        <div className="bg-white rounded-lg shadow-md p-4">
          {" "}
          <img
            src="https://via.placeholder.com/300"
            alt="Product"
            className="w-full h-48 object-cover mb-4"
          />
          <h2 className="text-xl font-semibold mb-2">Product Name</h2>{" "}
          <p className="text-gray-600 mb-2">$19.99</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add to Cart
          </button>{" "}
        </div>
        {/* Repeat this card structure for more products */}{" "}
      </div>
    </div>
  );
};

export default Shop;
