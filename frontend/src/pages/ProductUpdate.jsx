import React, { useState } from 'react';

export default function ProductUpdate() {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productImage, setProductImage] = useState(null);

  const fromData = new FormData();
  fromData.append('productName', productName);
  fromData.append('productDescription', productDescription);
  fromData.append('productPrice', productPrice);
  fromData.append('productImage', productImage);
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle update logic here
    console.log('Product updated');
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-96 rounded-lg shadow-lg p-6 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Update Product</h1>
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
          <label className="mb-1 font-medium" htmlFor="productDescription">
            Product Description
          </label>
          <textarea
            id="productDescription"
            name="productDescription"
            className="input validator mb-2"
            required
            placeholder="Product Description"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
          />
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
            className="btn bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
          >
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
}
