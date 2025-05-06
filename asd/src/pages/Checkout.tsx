import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Checkout: React.FC = () => {
  const { state } = useLocation() as any;     // product info passed in
  const navigate = useNavigate();
  const [addr, setAddr] = useState({
    fullName: "", email: "", phone: "",
    line1: "", line2: "",
    city: "", state: "", postalCode: "", country: "US",
  });
  const [loading, setLoading] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setAddr({ ...addr, [e.target.name]: e.target.value });

  const pay = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/create-checkout-session", {
        ...state,        // product, price, quantity…
        shipping: addr,
      });
      window.location.href = res.data.url;    // to Stripe
    } catch (err) {
      alert("Could not start checkout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold mb-6">Shipping address</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* repeat for every field */}
        <input name="fullName" placeholder="Full name" onChange={onChange} className="border p-2 rounded" />
        <input name="email"    placeholder="Email"     onChange={onChange} className="border p-2 rounded" />
        {/* …other inputs … */}
      </div>
      <button onClick={pay} disabled={loading}
              className="w-full py-3 bg-orange-500 text-white rounded">
        {loading ? "Redirecting…" : "Pay with card"}
      </button>
      <button onClick={()=>navigate(-1)} className="mt-4 underline text-sm">Back</button>
    </div>
  );
};

export default Checkout;
