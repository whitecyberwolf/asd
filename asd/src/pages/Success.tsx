// src/pages/Success.tsx
import React from "react";
import { FaCheckCircle } from "react-icons/fa";

const Success: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] px-4">
      {/* big green checkmark */}
      <FaCheckCircle className="text-green-500 text-6xl mb-4" />

      <h1 className="text-3xl font-semibold mb-2">Payment Successful</h1>

      <p className="text-gray-700 max-w-md text-center">
        Thank you for your purchase!<br />
        Our team will email your order confirmation and tracking details soon.
      </p>
    </div>
  );
};

export default Success;
