import React from 'react';

export const Pagination: React.FC = () => (
  <nav className="flex justify-center items-center mt-8 space-x-2">
    <button className="text-sm text-gray-600 hover:underline">Previous</button>
    {[1,2,3].map(n => (
      <button key={n}
        className={`px-3 py-1 border ${n===1 ? 'bg-gray-800 text-white' : 'text-gray-700'}`}
      >{n}</button>
    ))}
    <button className="text-sm text-gray-600 hover:underline">Next</button>
  </nav>
);