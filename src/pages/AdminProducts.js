import React, { useState } from 'react';

const AdminProducts = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Laptop Pro', price: 1299.99, stock: 50 },
    { id: 2, name: 'Smartphone X', price: 699.99, stock: 100 },
  ]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '' });
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddProduct = (e) => {
    e.preventDefault();
    setProducts([...products, { id: Date.now(), ...newProduct, price: parseFloat(newProduct.price), stock: parseInt(newProduct.stock) }]);
    setNewProduct({ name: '', price: '', stock: '' });
  };

  const handleUpdateProduct = (id, updatedProduct) => {
    setProducts(products.map((p) => (p.id === id ? { ...p, ...updatedProduct } : p)));
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setProducts(filtered);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Products</h1>
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="mt-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
          Search
        </button>
      </form>
      <form onSubmit={handleAddProduct} className="mb-4">
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          className="w-full p-3 border rounded-md mb-2"
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          className="w-full p-3 border rounded-md mb-2"
          required
        />
        <input
          type="number"
          placeholder="Stock"
          value={newProduct.stock}
          onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
          className="w-full p-3 border rounded-md mb-2"
          required
        />
        <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">
          Add Product
        </button>
      </form>
      <div>
        {products.map((product) => (
          <div key={product.id} className="flex items-center justify-between border-b py-4">
            <span>{product.name} - ${product.price} (Stock: {product.stock})</span>
            <div>
              <button
                onClick={() => handleUpdateProduct(product.id, { price: prompt('New Price?') })}
                className="mr-2 text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteProduct(product.id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;