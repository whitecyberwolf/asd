import React, { useEffect, useState } from 'react';
import api from '../api';

type PriceOption = { label: string; price: number };

interface Chain {
  _id?: string;
  name: string;
  images: string[];
  videos: string[];
  sizes: PriceOption[];
  metalTypes: PriceOption[];
  diamondTypes: PriceOption[];
  metalColors: PriceOption[];
  description: string;
}

export const AdminChainManager: React.FC = () => {
  const [category, setCategory] = useState<'men' | 'women'>('men');
  const [items, setItems] = useState<Chain[]>([]);
  const [form, setForm] = useState<Chain>({
    name: '',
    images: [],
    videos: [],
    sizes: [],
    metalTypes: [],
    diamondTypes: [],
    metalColors: [],
    description: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fetch on mount or category change
  useEffect(() => {
    fetchList();
  }, [category]);

  const fetchList = async () => {
    const res = await api.get(`/${category}-chains`);
    setItems(res.data);
  };

  const resetForm = () => {
    setForm({
      name: '',
      images: [],
      videos: [],
      sizes: [],
      metalTypes: [],
      diamondTypes: [],
      metalColors: [],
      description: '',
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await api.put(`/${category}-chains/${editingId}`, form);
    } else {
      await api.post(`/${category}-chains`, form);
    }
    await fetchList();
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this item?')) {
      await api.delete(`/${category}-chains/${id}`);
      fetchList();
    }
  };

  const handleEdit = (item: Chain) => {
    setEditingId(item._id!);
    setForm({
      name: item.name,
      images: item.images,
      videos: item.videos,
      sizes: item.sizes,
      metalTypes: item.metalTypes,
      diamondTypes: item.diamondTypes,
      metalColors: item.metalColors,
      description: item.description,
    });
  };

  // helper to render dynamic variant lists
  const renderVariantField = (field: keyof Chain, label: string) => (
    <div>
      <label className="font-semibold">{label}:</label>
      {Array.isArray(form[field]) && form[field].map((opt: any, i: number) => (
        <div key={i} className="flex space-x-2 mt-1">
          <input
            type="text"
            placeholder="label"
            value={opt.label}
            onChange={e => {
              const arr = [...(form[field] as PriceOption[])];
              arr[i].label = e.target.value;
              setForm(f => ({ ...f, [field]: arr }));
            }}
            className="border p-1 flex-1"
          />
          <input
            type="number"
            placeholder="price"
            value={opt.price}
            onChange={e => {
              const arr = [...(form[field] as PriceOption[])];
              arr[i].price = Number(e.target.value);
              setForm(f => ({ ...f, [field]: arr }));
            }}
            className="border p-1 w-24"
          />
          <button
            type="button"
            onClick={() => {
              const arr = (form[field] as PriceOption[]).filter((_, j) => j !== i);
              setForm(f => ({ ...f, [field]: arr }));
            }}
          >✕</button>
        </div>
      ))}
      <button
        type="button"
        className="mt-1 text-blue-600"
        onClick={() => {
          const arr = [...(form[field] as PriceOption[]), { label: '', price: 0 }];
          setForm(f => ({ ...f, [field]: arr }));
        }}
      >+ add {label}</button>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-4">
        <button
          className={`px-4 py-2 mr-2 ${category==='men'? 'bg-blue-600 text-white':'bg-gray-200'}`}
          onClick={()=>{ setCategory('men'); resetForm(); }}
        >Men’s Chains</button>
        <button
          className={`px-4 py-2 ${category==='women'? 'bg-pink-600 text-white':'bg-gray-200'}`}
          onClick={()=>{ setCategory('women'); resetForm(); }}
        >Women’s Chains</button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          required
          onChange={e=>setForm(f=>({ ...f, name: e.target.value }))}
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Image URLs (comma separated)"
          value={form.images.join(',')}
          onChange={e=>setForm(f=>({ ...f, images: e.target.value.split(',').filter(u=>u) }))}
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Video URLs (comma separated)"
          value={form.videos.join(',')}
          onChange={e=>setForm(f=>({ ...f, videos: e.target.value.split(',').filter(u=>u) }))}
          className="border p-2 w-full"
        />

        {renderVariantField('sizes','Sizes')}
        {renderVariantField('metalTypes','Metal Types')}
        {renderVariantField('diamondTypes','Diamond Types')}
        {renderVariantField('metalColors','Metal Colors')}

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={e=>setForm(f=>({ ...f, description: e.target.value }))}
          className="border p-2 w-full"
          rows={4}
        />

        <div className="flex space-x-2">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {editingId ? 'Update' : 'Add'} Chain
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >Cancel</button>
          )}
        </div>
      </form>

      <div className="grid grid-cols-4 gap-4">
        {items.map(item => (
          <div key={item._id} className="border p-4 rounded space-y-2 bg-white">
            {item.images[0] && (
              <img src={item.images[0]} alt="" className="h-24 w-full object-cover rounded" />
            )}
            <h3 className="font-semibold">{item.name}</h3>
            <div className="flex space-x-2">
              <button
                onClick={()=>handleEdit(item)}
                className="text-blue-600"
              >Edit</button>
              <button
                onClick={()=>handleDelete(item._id!)}
                className="text-red-600"
              >Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminChainManager;
