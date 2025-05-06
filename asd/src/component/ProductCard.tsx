import React from "react";
import { Link } from "react-router-dom";

interface Props {
  category: "men" | "women" ;   // NEW
  id: string;
  name: string;
  image: string;
  price: number;
  original?: number;
  badge?: string;
  to: string;
}

const formatCurrency = (n?: number) =>
    typeof n === 'number'
     ? `$${n.toLocaleString('en-US', {
        minimumFractionDigits: 2,
         maximumFractionDigits: 2
     })}`
     : '-';
export const ProductCard: React.FC<Props> = ({
  category, id, name, image, price, original, badge
}) => (
  <Link to={`/${category}/${id}`}>
    <div className="relative border rounded-lg p-4 hover:shadow-lg">
      {badge && (
        <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2">
          {badge}
        </span>
      )}
      <img src={image} alt={name} className="w-full h-48 object-cover mb-4" />
      <h4 className="text-sm font-medium">{name}</h4>
      <div className="mt-1">
      <span className="text-lg font-semibold">{formatCurrency(price)}</span>
        {original && (
          <span className="line-through text-gray-400 ml-2">
            ₹{original.toLocaleString()}
          </span>
        )}
      </div>
    </div>
  </Link>
);
