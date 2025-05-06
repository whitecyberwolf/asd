import React from 'react';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

interface Product {
  _id: string;
  name: string;
  images: string[];
}

export default function MensBraceletPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    api
      .get('/products', { params: { category: "Men's bracelet" } })
      .then(res => {
        const list = Array.isArray(res.data)
          ? res.data
          : res.data?.products ?? [];
        setProducts(list as Product[]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Men&rsquo;s Bracelets</h1>

      {loading ? (
        <p>Loading products…</p>
      ) : products.length === 0 ? (
        <p>No bracelets found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(p => (
            <div key={p._id} className="bg-white rounded shadow overflow-hidden">
              {/* Image or placeholder */}
              {p.images[0] ? (
                <img
                  src={`/uploads/${p.images[0]}`}
                  alt={p.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                  No Image
                </div>
              )}

              {/* Name */}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-center">{p.name}</h2>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
