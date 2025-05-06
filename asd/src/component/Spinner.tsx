// src/components/Spinner.tsx
import React from 'react';

const Spinner: React.FC = () => (
  <div className="flex justify-center items-center py-10">
    <div
      className="w-12 h-12 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"
      aria-label="Loading…"
    />
  </div>
);

export default Spinner;
