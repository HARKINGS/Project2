import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const products = [
  { id: 1, name: 'Laptop Pro', price: 1299.99, category: 'Electronics' },
  { id: 2, name: 'Smartphone X', price: 699.99, category: 'Electronics' },
  { id: 3, name: 'Running Shoes', price: 89.99, category: 'Fashion' },
  { id: 4, name: 'Winter Jacket', price: 149.99, category: 'Fashion' },
  { id: 5, name: 'Gaming Mouse', price: 49.99, category: 'Electronics' },
  { id: 6, name: 'Casual Sneakers', price: 59.99, category: 'Fashion' },
];

const SearchPage = ({ addToCart }) => {
  const [searchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    const query = searchParams.get('query') || '';
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchParams]);

  return (
    <div className="container mx-auto py-12 px-4 bg-gray-50 min-h-screen">
      {/* Search Bar (Sticky) */}
      <div className="mb-12 sticky top-0 bg-white p-4 shadow-md z-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Search Results</h1>
        <div className="max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search for products..."
            defaultValue={searchParams.get('query') || ''}
            onChange={(e) => {
              const query = e.target.value;
              if (query) {
                window.history.pushState({}, '', `/search?query=${encodeURIComponent(query)}`);
                const filtered = products.filter(
                  (product) =>
                    product.name.toLowerCase().includes(query.toLowerCase()) ||
                    product.category.toLowerCase().includes(query.toLowerCase())
                );
                setFilteredProducts(filtered);
              } else {
                setFilteredProducts(products);
              }
            }}
            className="w-full p-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg transition duration-300"
          />
        </div>
      </div>

      {/* Search Results */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          {searchParams.get('query')
            ? `Results for "${searchParams.get('query')}"`
            : 'All Products'}
        </h2>
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={() => addToCart(product)}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg">
            No products found matching your search.
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;