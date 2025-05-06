/* ChainsList.tsx – Men's Diamond‑Chain catalog page
 * Needs:
 *   axios    → src/lib/api.ts (baseURL '/api')
 *   gsap
 *   @radix-ui/react-icons
 */
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ListBulletIcon,
  GridIcon,
  RowsIcon,
  HeartIcon,
  ChevronDownIcon,
} from '@radix-ui/react-icons';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { api } from '../../lib/api';

gsap.registerPlugin(ScrollTrigger);

/* ---------- Types ---------- */
interface Variant { label: string; price: number }
interface Product {
  _id: string;
  name: string;
  images: string[];
  price?: number;                       // optional standalone price
  originalPrice?: number;
  discount?: number;
  diamondType?: string;
  style?: string;
  inStock?: boolean;
  // variant arrays
  sizes?: Variant[];
  metalTypes?: Variant[];
  diamondTypes?: Variant[];
  metalColors?: Variant[];
}

/* ---------- Helper: lowest price from any variant ---------- */
const firstPrice = (p: Product) => {
  // 1) if product.price exists and is finite, use it
  if (Number.isFinite(p.price)) return p.price as number;

  // 2) collect numeric prices from all variant arrays
  const nums = [
    ...(p.sizes || []),
    ...(p.metalTypes || []),
    ...(p.diamondTypes || []),
    ...(p.metalColors || []),
  ]
    .map(v => Number(v?.price))
    .filter(n => Number.isFinite(n));

  // 3) return the cheapest, or NaN if none
  return nums.length ? Math.min(...nums) : NaN;
};

/* ───────────── Component ───────────── */
const ChainsList: React.FC = () => {
  const nav = useNavigate();

  /* Data */
  const [all, setAll]           = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  /* Filters */
  const [price, setPrice]         = useState<[number,number]>([0,250_000]);
  const [diamondTypes,setDiam]    = useState<string[]>([]);
  const [styles,setStyles]        = useState<string[]>([]);
  const [stockIn,setStockIn]      = useState(false);
  const [stockOut,setStockOut]    = useState(false);

  /* UI */
  const [view,setView] = useState<0|1|2>(1);
  const [sort,setSort] = useState<'best'|'low-high'|'high-low'>('best');
  const perPage = 9;
  const [page,setPage] = useState(1);

  /* GSAP */
  const gridRef = useRef<HTMLDivElement>(null);

  /* ---------- Fetch “Men's chain” ---------- */
  useEffect(()=>{
    (async()=>{
      try{
        setLoading(true);
        const {data} = await api.get('/products',{params:{category:"Men's chain"}});
        const arr =
          Array.isArray(data)           ? data :
          Array.isArray(data?.products) ? data.products :
          Array.isArray(data?.chains)   ? data.chains : [];
        setAll(arr);
      }catch(e){
        console.error(e);
        setError('Failed to load products.');
      }finally{
        setLoading(false);
      }
    })();
  },[]);

  /* ---------- Initialize price range ---------- */
  useEffect(()=>{
    if(!all.length) return;
    const nums = all.map(firstPrice).filter(Number.isFinite);
    if(nums.length) setPrice([Math.min(...nums),Math.max(...nums)]);
  },[all]);

  /* ---------- Filter + Sort ---------- */
  useEffect(()=>{
    let list=[...all];

    if(stockIn)  list=list.filter(p=>p.inStock!==false);
    if(stockOut) list=list.filter(p=>p.inStock===false);

    list=list.filter(p=>{
      const v=firstPrice(p);
      if(!Number.isFinite(v)) return true;            // keep if no price
      return v>=price[0] && v<=price[1];
    });

    if(diamondTypes.length)
      list=list.filter(p=>diamondTypes.includes(p.diamondType||''));
    if(styles.length)
      list=list.filter(p=>styles.includes(p.style||''));

    if(sort==='low-high')  list.sort((a,b)=>firstPrice(a)-firstPrice(b));
    if(sort==='high-low') list.sort((a,b)=>firstPrice(b)-firstPrice(a));

    setFiltered(list);
    setPage(1);
  },[all,price,diamondTypes,styles,stockIn,stockOut,sort]);

  /* ---------- GSAP fade‑in ---------- */
  useEffect(()=>{
    if(!gridRef.current) return;
    const cards=gridRef.current.querySelectorAll('.product-card');
    if(cards.length===0) return;
    gsap.from(cards,{
      opacity:0,y:40,duration:0.6,stagger:0.1,ease:'power2.out',
      scrollTrigger:{trigger:gridRef.current,start:'top bottom-=100'}
    });
  },[filtered]);

  /* Pagination */
  const totalPages=Math.ceil(filtered.length/perPage);
  const slice=filtered.slice((page-1)*perPage,page*perPage);

  /* Helpers */
  const toggleArr=(set:React.Dispatch<React.SetStateAction<string[]>>,v:string)=>
    set(prev=>prev.includes(v)?prev.filter(x=>x!==v):[...prev,v]);

  /* ---------- JSX ---------- */
  return (
    <div className="max-w-screen-2xl mx-auto">
      {/* Hero */}
      <section className="relative bg-black text-yellow-400 h-72 flex items-center justify-center mb-8">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold uppercase tracking-wide mb-3">
            Diamond Chains
          </h1>
          <p className="text-sm sm:text-lg text-yellow-300">
            Luxury Diamond Chains for Every Occasion
          </p>
        </div>
      </section>

      <div className="px-4 flex flex-col lg:flex-row gap-8">
        {/* ---------- Sidebar ---------- */}
        <aside className="w-full lg:w-72 shrink-0">
          <h2 className="font-bold text-xl mb-4 uppercase text-gray-700">Filters</h2>

          <Filter title="Availability">
            <Check label="In stock" checked={stockIn}
                   onChange={()=>{setStockIn(!stockIn);setStockOut(false)}}/>
            <Check label="Out of stock" checked={stockOut}
                   onChange={()=>{setStockOut(!stockOut);setStockIn(false)}}/>
          </Filter>

          <Filter title="Price">
            <PriceRange min={price[0]} max={price[1]} value={price} onChange={setPrice}/>
          </Filter>

          <Filter title="Diamond Type">
            {['Moissanite Diamond','Lab Diamond','Real Dial Diamond'].map(t=>(
              <Check key={t} label={t}
                     checked={diamondTypes.includes(t)}
                     onChange={()=>toggleArr(setDiam,t)}/>
            ))}
          </Filter>

          <Filter title="Style">
            {['Hip-Hop','Regular'].map(s=>(
              <Check key={s} label={s}
                     checked={styles.includes(s)}
                     onChange={()=>toggleArr(setStyles,s)}/>
            ))}
          </Filter>
        </aside>

        {/* ---------- Main ---------- */}
        <section className="flex-1">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-4">
              {[ListBulletIcon,GridIcon,RowsIcon].map((I,i)=>(
                <I key={i} onClick={()=>setView(i as 0|1|2)}
                   className={`cursor-pointer ${view===i?'text-purple-600':'text-gray-400'}`}/>
              ))}
            </div>

            <div className="flex items-center space-x-6">
              <label className="text-sm">
                Sort by:{' '}
                <select value={sort} onChange={e=>setSort(e.target.value as any)}
                        className="border rounded px-2 py-1">
                  <option value="best">Best selling</option>
                  <option value="low-high">Price: Low to High</option>
                  <option value="high-low">Price: High to Low</option>
                </select>
              </label>
              <span className="text-gray-600">{filtered.length} Products</span>
            </div>
          </div>

          {/* Empty state */}
          {!loading && !error && filtered.length===0 && (
            <p className="text-center text-gray-500">No products found.</p>
          )}

          {/* Grid */}
          {loading && <p>Loading…</p>}
          {error   && <p className="text-red-500">{error}</p>}

          <div ref={gridRef}
               className={`grid gap-6 ${
                 view===0?'grid-cols-1':view===1?'grid-cols-3':'grid-cols-4'
               }`}>
            {slice.map(p=>(
              <Card key={p._id} p={p}
                    onClick={()=>nav(`/product/${p._id}`)}/>
            ))}
          </div>

          {totalPages>1 && (
            <Pagination page={page} total={totalPages}
                        onPrev={()=>setPage(p=>p-1)}
                        onNext={()=>setPage(p=>p+1)}/>
          )}
        </section>
      </div>
    </div>
  );
};

export default ChainsList;

/* ---------- Small sub‑components ---------- */
const Check:React.FC<{label:string;checked:boolean;onChange:()=>void}> =
  ({label,checked,onChange})=>(
  <label className="flex items-center text-sm mb-1">
    <input type="checkbox" className="mr-2" checked={checked} onChange={onChange}/>
    {label}
  </label>
);

const Filter:React.FC<{title:string;children:React.ReactNode}> =
  ({title,children})=>{
  const [open,setOpen]=useState(false);
  return(
    <div className="border-b mb-4 pb-4">
      <button onClick={()=>setOpen(o=>!o)}
              className="flex justify-between w-full items-center">
        <span className="font-semibold text-gray-800">{title}</span>
        <ChevronDownIcon className={`transition-transform ${open?'rotate-180':''}`}/>
      </button>
      {open && <div className="mt-2">{children}</div>}
    </div>
  );
};

const PriceRange:React.FC<{
  min:number;max:number;value:[number,number];onChange:(v:[number,number])=>void;
}> = ({min,max,value,onChange})=>(
  <>
    <label htmlFor="pmin" className="sr-only">Minimum price</label>
    <label htmlFor="pmax" className="sr-only">Maximum price</label>

    <div className="flex space-x-2">
      <input id="pmin" type="range" min={min} max={max} value={value[0]}
             onChange={e=>onChange([+e.target.value,value[1]])}
             className="flex-1" aria-label="Minimum price"/>
      <input id="pmax" type="range" min={min} max={max} value={value[1]}
             onChange={e=>onChange([value[0],+e.target.value])}
             className="flex-1" aria-label="Maximum price"/>
    </div>
    <div className="flex space-x-2 mt-2">
      <input type="number" value={value[0]}
             onChange={e=>onChange([+e.target.value,value[1]])}
             className="border p-1 rounded w-1/2" placeholder="Min"/>
      <input type="number" value={value[1]}
             onChange={e=>onChange([value[0],+e.target.value])}
             className="border p-1 rounded w-1/2" placeholder="Max"/>
    </div>
  </>
);

const Card:React.FC<{p:Product;onClick:()=>void}> = ({p,onClick})=>{
  const price=firstPrice(p);
  const orig =p.discount
    ? ((price*100)/(100-p.discount)).toFixed(2)
    : p.originalPrice;

  return(
    <div onClick={onClick}
         className="product-card relative bg-white border rounded shadow hover:shadow-lg transition cursor-pointer">
      {p.discount && (
        <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
          Sale –{p.discount}%
        </span>
      )}

      <img src={p.images[0] || '/placeholder.jpg'}
           alt={p.name}
           className="w-full h-64 object-cover"/>

      <HeartIcon className="absolute top-2 right-2 text-gray-300 hover:text-red-500"/>

      <div className="p-4 space-y-1">
        <h3 className="text-xs uppercase text-gray-400">Aprilshine Diamond</h3>
        <h2 className="font-semibold text-lg text-gray-800 line-clamp-2 h-12">
          {p.name}
        </h2>
        <div>
          <span className="text-yellow-600 font-bold">
            {Number.isFinite(price) ? `$${price.toLocaleString()}` : '—'}
          </span>
          {orig && (
            <span className="text-sm text-gray-400 line-through ml-2">
              ${(+orig).toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const Pagination:React.FC<{
  page:number;total:number;onPrev:()=>void;onNext:()=>void;
}> = ({page,total,onPrev,onNext})=>(
  <div className="flex justify-center mt-8 gap-4">
    <Btn disabled={page===1} onClick={onPrev}>Prev</Btn>
    <span className="text-gray-600">Page {page} of {total}</span>
    <Btn disabled={page===total} onClick={onNext}>Next</Btn>
  </div>
);

const Btn:React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> =
  ({children,...rest})=>(
  <button {...rest}
          className={`border px-4 py-2 rounded ${
            rest.disabled
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'hover:bg-gray-100'
          }`}>
    {children}
  </button>
);
