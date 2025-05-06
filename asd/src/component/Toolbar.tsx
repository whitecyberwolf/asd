import React from 'react';

export const Toolbar: React.FC<{ total: number }> = ({ total }) => (
  <div className="flex justify-between items-center mb-4">
    <div className="font-semibold">DIAMOND WATCHES | {total} Products</div>
    <div className="flex items-center space-x-2">
      <label htmlFor="sort" className="text-sm">Sort By:</label>
      <select id="sort" className="border p-1 rounded text-sm">
        <option>Best selling</option>
        <option>Price: Low to High</option>
        <option>Price: High to Low</option>
      </select>
    </div>
  </div>
);