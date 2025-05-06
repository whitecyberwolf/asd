import React, { useEffect, useState } from 'react';
import api from '../api';

type PriceOption = { label: string; price: number };
type Watch = {
  _id?: string;
  name: string;
  images: string[];
  videos: string[];
  sizes: PriceOption[];
  metalTypes: PriceOption[];
  diamondTypes: PriceOption[];
  metalColors: PriceOption[];
  description: string;
};

export const AdminWatchManager: React.FC = () => {
  const [category, setCategory] = useState<'men'|'women'>('men');
  const [items, setItems] = useState<Watch[]>([]);
  const [form, setForm] = useState<Watch>({
    name: '', images: [], videos: [],
    sizes: [], metalTypes: [], diamondTypes: [], metalColors: [],
    description: ''
  });

  // fetch on mount & category change
  useEffect(() => {
    api.get(`/${category}-watches`).then(r => setItems(r.data));
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post(`/${category}-watches`, form);
    setForm({ name:'',images:[],videos:[],sizes:[],metalTypes:[],diamondTypes:[],metalColors:[],description:'' });
    const r = await api.get(`/${category}-watches`);
    setItems(r.data);
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/${category}-watches/${id}`);
    setItems(items.filter(i => i._id !== id));
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <button
          className={`px-4 py-2 mr-2 ${category==='men' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={()=>setCategory('men')}
        >Men Watches</button>
        <button
          className={`px-4 py-2 ${category==='women' ? 'bg-pink-600 text-white' : 'bg-gray-200'}`}
          onClick={()=>setCategory('women')}
        >Women Watches</button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 space-y-4">
        <input
          type="text" placeholder="Name"
          value={form.name}
          onChange={e=>setForm({...form,name:e.target.value})}
          className="border p-2 w-full"
          required
        />

        {/* For brevity: use comma-separated URLs for images/videos */}
        <input
          type="text" placeholder="Image URLs (comma separated, max 10)"
          value={form.images.join(',')}
          onChange={e=>setForm({...form,images:e.target.value.split(',').filter(u=>u)})}
          className="border p-2 w-full"
        />

        <input
          type="text" placeholder="Video URLs (comma separated, max 5)"
          value={form.videos.join(',')}
          onChange={e=>setForm({...form,videos:e.target.value.split(',').filter(u=>u)})}
          className="border p-2 w-full"
        />

        {/* Dynamic priceOption arrays */}
        {(['sizes','metalTypes','diamondTypes','metalColors'] as const).map(field => (
          <div key={field}>
            <label className="font-semibold">{field}:</label>
            {form[field].map((opt, i) => (
              <div key={i} className="flex space-x-2 mt-1">
                <input
                  type="text" placeholder="label"
                  value={opt.label}
                  onChange={e=>{
                    const arr = [...form[field]];
                    arr[i].label = e.target.value;
                    setForm({...form, [field]: arr} as any);
                  }}
                  className="border p-1 flex-1"
                />
                <input
                  type="number" placeholder="price"
                  value={opt.price}
                  onChange={e=>{
                    const arr = [...form[field]];
                    arr[i].price = Number(e.target.value);
                    setForm({...form, [field]: arr} as any);
                  }}
                  className="border p-1 w-24"
                />
                <button type="button" onClick={()=>{
                  const arr = form[field].filter((_,j)=>j!==i);
                  setForm({...form, [field]: arr} as any);
                }}>✕</button>
              </div>
            ))}
            <button
              type="button"
              className="mt-1 text-blue-600"
              onClick={()=> {
                const arr = [...form[field], {label:'',price:0}];
                setForm({...form, [field]: arr} as any);
              }}
            >+ add {field}</button>
          </div>
        ))}

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={e=>setForm({...form, description:e.target.value})}
          className="border p-2 w-full"
          rows={4}
        />

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Add {category==='men'?'Men':'Women'} Watch
        </button>
      </form>

      {/* Product List Grid */}
      <div className="grid grid-cols-4 gap-4">
        {items.map(item => (
          <div key={item._id} className="border p-4 rounded space-y-2">
            {item.images[0] && <img src={item.images[0]} alt="" className="h-24 w-full object-cover rounded" />}
            <h3 className="font-semibold">{item.name}</h3>
            <div className="flex space-x-2">
              <button
                onClick={()=>handleDelete(item._id!)}
                className="text-red-600"
              >Delete</button>
              {/* Edit would navigate to an edit form—implement as needed */}
              <button
                onClick={()=> alert('Implement edit flow')}
                className="text-blue-600"
              >Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
