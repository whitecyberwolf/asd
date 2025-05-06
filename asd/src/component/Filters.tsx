import React, { useState } from 'react';

export const Filters: React.FC = () => {
  const [priceRange, setPriceRange] = useState<[number,number]>([30000,250000]);
  const [movement, setMovement] = useState<string[]>([]);
  const [diamondType, setDiamondType] = useState<string[]>([]);
  const [style, setStyle] = useState<string[]>([]);

  return (
    <aside className="w-64 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold">Filters</h2>
        <button className="text-sm text-gray-500 hover:underline">Clear All ✕</button>
      </div>

      {/* Price Slider */}
      <div>
        <h3 className="font-medium">Price</h3>
        <div className="flex items-center space-x-2 mt-2">
          <input
            type="number"
            value={priceRange[0]}
            className="border p-1 w-20"
            placeholder="Min Price"
            onChange={e => setPriceRange([+e.target.value, priceRange[1]])}
          />
          <span>-</span>
          <input
            type="number"
            value={priceRange[1]}
            className="border p-1 w-20"
            placeholder="Max Price"
            onChange={e => setPriceRange([priceRange[0], +e.target.value])}
          />
        </div>
        {/* Implement a range slider library or custom slider beneath */}
      </div>

      {/* Checkbox Groups */}
      {[
        { label: 'Movement', options: ['Cellular','Automatic'], state: movement, set: setMovement },
        { label: 'Diamond Type', options: ['Moissanite Diamond','Lab Diamond','Real Dial Diamond'], state: diamondType, set: setDiamondType },
        { label: 'Style', options: ['Hip-Hop','Regular'], state: style, set: setStyle }
      ].map(group => (
        <div key={group.label}>
          <h3 className="font-medium">{group.label}</h3>
          <div className="space-y-1 mt-2">
            {group.options.map(opt => (
              <label key={opt} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={group.state.includes(opt)}
                  onChange={() => {
                    const arr = group.state.includes(opt)
                      ? group.state.filter(x=>x!==opt)
                      : [...group.state,opt];
                    group.set(arr);
                  }}
                  className="form-checkbox h-4 w-4"
                />
                <span className="ml-2 text-sm">{opt}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
};  