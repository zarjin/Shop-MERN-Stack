import React, { useState } from "react";

export default function CreateProduct() {
  const [productName, setProductName] = useState("");
  const [productDescripation, setProductDescripation] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImage, setProductImage] = useState(null);

  const fromData = new FormData();
  fromData.append("productName", productName);
  fromData.append("productDescripation", productDescripation);
  fromData.append("productPrice", productPrice);
  fromData.append("productImage", productImage);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
    // you can grab form values using e.target.elements or FormData her
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-96 rounded-lg shadow-lg p-6 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Create Product</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-full"
          encType="multipart/form-data"
        >
          <label className="mb-1 font-medium" htmlFor="productName">
            Product Name
          </label>
          <input
            type="text"
            id="productName"
            name="productName"
            className="input validator mb-2"
            required
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
          <p className="validator-hint mb-3 text-sm text-gray-500">
            Enter a valid product name
          </p>

          <label className="mb-1 font-medium" htmlFor="productDescripation">
            Product Descripation
          </label>
          <textarea
            id="productDescripation"
            name="productDescripation"
            className="input validator mb-2"
            required
            placeholder="Product Descripation"
            value={productDescripation}
            onChange={(e) => setProductDescripation(e.target.value)}
          />
          <p className="validator-hint mb-3 text-sm text-gray-500">
            Enter a valid product descripation
          </p>

          <label className="mb-1 font-medium" htmlFor="productPrice">
            Product Price
          </label>
          <input
            type="number"
            id="productPrice"
            name="productPrice"
            className="input validator mb-2"
            required
            placeholder="Product Price"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
          />
          <p className="validator-hint mb-3 text-sm text-gray-500">
            Enter a valid product price
          </p>

          <label className="mb-1 font-medium" htmlFor="productImage">
            Product Image
          </label>
          <input
            type="file"
            id="productImage"
            name="productImage"
            className="file-input mb-4"
            accept="image/*"
            onChange={(e) => setProductImage(e.target.files[0])}
          />

          <button
            type="submit"
            className="btn bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Create Product
          </button>
        </form>
      </div>
    </div>
  );
}
