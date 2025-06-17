import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllGoods } from '../api/Goods';

const StaffProducts = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    goodsName: '',
    goodsVersion: '',
    price: '',
    quantity: '',
    goodsBrand: '',
    goodsDescription: '',
    goodsCategory: '',
    goodsImageURL: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllGoods();
        const result = await data.json();
        if (result.code === 1000) {
          setProducts(result.result || []);
        } else {
          throw new Error(result.message || 'Failed to fetch products');
        }
      } catch (error) {
        setError('Failed to load products. Please check your token or try again.');
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(newProduct).forEach(key => {
        if (key !== 'goodsImageURL' && newProduct[key]) {
          formData.append(key, newProduct[key]);
        }
      });
      if (newProduct.imageFile) {
        formData.append('image', newProduct.imageFile);
      }

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/goods/add`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (response.ok && data.code === 1000) {
        setProducts([...products, data.result]);
        setNewProduct({
          goodsName: '',
          goodsVersion: '',
          price: '',
          quantity: '',
          goodsBrand: '',
          goodsDescription: '',
          goodsCategory: '',
          goodsImageURL: '',
        });
        setError(null);
      } else {
        throw new Error(data.message || 'Failed to add product');
      }
    } catch (error) {
      setError('Error adding product. Please check your input or token.');
      console.error('Error adding product:', error);
    }
  };

  const handleUpdateProduct = async (id) => {
    try {
      const updatedProduct = {
        goodsName: prompt('New Name?', products.find(p => p.goodsId === id).goodsName) || '',
        price: prompt('New Price?', products.find(p => p.goodsId === id).price) || '',
        quantity: prompt('New Quantity?', products.find(p => p.goodsId === id).quantity) || '',
        goodsCategory: prompt('New Category?', products.find(p => p.goodsId === id).goodsCategory) || '',
      };
      const formData = new FormData();
      Object.keys(updatedProduct).forEach(key => formData.append(key, updatedProduct[key]));
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/goods/update/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (response.ok && data.code === 1000) {
        setProducts(products.map(p => p.goodsId === id ? { ...p, ...updatedProduct } : p));
        setError(null);
      } else {
        throw new Error(data.message || 'Failed to update product');
      }
    } catch (error) {
      setError('Error updating product. Please try again.');
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/goods/delete/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        if (response.ok && data.code === 1000) {
          setProducts(products.filter(p => p.goodsId !== id));
          setError(null);
        } else {
          throw new Error(data.message || 'Failed to delete product');
        }
      } catch (error) {
        setError('Error deleting product. Please try again.');
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = products.filter((p) =>
      p.goodsName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setProducts(filtered);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProduct((prev) => ({ ...prev, imageFile: file, goodsImageURL: URL.createObjectURL(file) }));
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Products</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
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
      <form onSubmit={handleAddProduct} className="mb-4 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Add New Product</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.goodsName}
            onChange={(e) => setNewProduct({ ...newProduct, goodsName: e.target.value })}
            className="w-full p-3 border rounded-md"
            required
          />
          <input
            type="text"
            placeholder="Version"
            value={newProduct.goodsVersion}
            onChange={(e) => setNewProduct({ ...newProduct, goodsVersion: e.target.value })}
            className="w-full p-3 border rounded-md"
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            className="w-full p-3 border rounded-md"
            required
          />
          <input
            type="number"
            placeholder="Quantity"
            value={newProduct.quantity}
            onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
            className="w-full p-3 border rounded-md"
            required
          />
          <input
            type="text"
            placeholder="Brand"
            value={newProduct.goodsBrand}
            onChange={(e) => setNewProduct({ ...newProduct, goodsBrand: e.target.value })}
            className="w-full p-3 border rounded-md"
          />
          <textarea
            placeholder="Description"
            value={newProduct.goodsDescription}
            onChange={(e) => setNewProduct({ ...newProduct, goodsDescription: e.target.value })}
            className="w-full p-3 border rounded-md"
          />
          <input
            type="text"
            placeholder="Category"
            value={newProduct.goodsCategory}
            onChange={(e) => setNewProduct({ ...newProduct, goodsCategory: e.target.value })}
            className="w-full p-3 border rounded-md"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-3 border rounded-md"
          />
          <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">
            Add Product
          </button>
        </div>
      </form>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Product List</h2>
        {products.map((product) => (
          <div key={product.goodsId} className="flex items-center justify-between border-b py-4">
            <div>
              <img src={product.goodsImageURL || 'https://via.placeholder.com/100'} alt={product.goodsName} className="w-16 h-16 object-cover mr-4" />
              <span>{product.goodsName} - ${product.price} (Stock: {product.quantity})<br />Category: {product.goodsCategory}</span>
            </div>
            <div>
              <button
                onClick={() => handleUpdateProduct(product.goodsId)}
                className="mr-2 text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteProduct(product.goodsId)}
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

export default StaffProducts;