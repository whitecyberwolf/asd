// src/pages/Cancel.tsx
import React from "react";
import { Link } from "react-router-dom";

const Cancel: React.FC = () => (
  <div className="flex flex-col items-center py-20">
    <h1 className="text-2xl font-bold mb-4 text-yellow-600">
      Checkout cancelled
    </h1>
    <p className="mb-10 text-gray-600">
      No worries—you can resume checkout whenever you’re ready.
    </p>
    <Link
      to="/"
      className="px-6 py-3 bg-gray-900 text-white rounded shadow-md"
    >
      Back to store
    </Link>
  </div>
);

export default Cancel;
