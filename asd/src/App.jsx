// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Component Imports
import NavBar from "./component/navbar";
import Footer from "./component/Footer";
import HomePage from "./pages/Home";
import PersonalizedPage from "./pages/PersonalizedPage";
import GlassesList from "./component/Product/GlassesList";
import ProductDetails from "./component/Product/ProductDetails";
import ChainsList from "./component/Product/ChainsList";
import WatchesList from "./component/Product/WatchesList";
import WatchDetail from "./component/Product/WatchesDetails"; // New watch detail component (Stripe integration)
import BraceletList from "./component/Product/BraceletList";
import RingList from "./component/Product/RingList";
import NecklacesList from "./component/Product/NecklacesList";
import EarringList from "./component/Product/EarringList";
import GlassDetails from "./component/Product/GlassDetails";
import Shop from "./component/Product/Shop";
import PendentList from "./component/Product/PendentList"; // <-- Import your new component here
// import PendantDetail from "./component/Product/PendantDetail";

// Page Imports
import AboutUs from "./pages/AboutUs";
import ASDCare from "./pages/ASDCare";
import InternationalSupplyPage from "./pages/InternationalSupplypage";
import TermsOfService from "./pages/TermsOfService";
import CartPage from "./pages/CartPage";
import Success from "./pages/Success";
import Cancel  from "./pages/Cancel";

// Firebase imports (if used for authentication or cart syncing)
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import PendantDetail from './component/Product/PendantDetail';
import RingDetail from './component/Product/RingDetail';
import BraceletDetail from "./component/Product/bracelet-detail";
import GlassDetail from "./component/Product/GlassDetails";

import BlogSection from "./pages/blog/BlogSection";
import BlogPost from './pages/blog/BlogPost';

import Checkout from './pages/Checkout'

import CartCheckout from './component/navbar/CartCheckout'

const App = () => {
  const [cartItems, setCartItems] = useState([]);

  // Define the add-to-cart callback to pass down to product detail components
  const handleAddToCart = (item) => {
    setCartItems((prev) => [...prev, item]);
  };

  // Example: Load the user's cart from Firestore when authentication state changes
  const auth = getAuth();
  const db = getFirestore();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const cartRef = doc(db, "carts", user.uid);
        const cartSnap = await getDoc(cartRef);
        if (cartSnap.exists()) {
          setCartItems(cartSnap.data().items);
        } else {
          // Initialize an empty cart if not present
          await setDoc(cartRef, { items: [] });
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    });
    return unsubscribe;
  }, [auth, db]);

  // Whenever cartItems change, update Firestore (if the user is logged in)
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const cartRef = doc(db, "carts", user.uid);
      setDoc(cartRef, { items: cartItems });
    }
  }, [cartItems, auth, db]);

  return (
    <Router>
      <NavBar cartItems={cartItems} setCartItems={setCartItems} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/personalized" element={<PersonalizedPage />} />
        <Route path="/GlassesList" element={<GlassesList />} />
        <Route path="/eyeglasses/:id" element={<GlassDetail />} />
        <Route path="/blog/:id" element={<BlogPost />} />

        <Route path="/ChainsDetails" element={<ChainsList />} />
        <Route path="/WatchesList" element={<WatchesList />} />
        {/* New watch detail route with Stripe Buy Now integration */}
        <Route
          path="/watch/:id"
          element={<WatchDetail onAddToCart={handleAddToCart} />}
        />
        <Route path="/BraceletList" element={<BraceletList />} />
        <Route path="/bracelets/:id" element={<bracelet-detail/>} />
        <Route path="/bracelet/:id" element={<BraceletDetail />} />
        
        <Route path="/RingList" element={<RingList />} />
        <Route path="/rings/:id" element={<RingDetail />} />

        <Route path="/NecklacesList" element={<NecklacesList />} />
        <Route path="/EarringList" element={<EarringList />} />

        <Route path="/BlogSection" element={<BlogSection/>}/>
        {/* PendentList Route (NEW) */}
        <Route path="/PendentList" element={<PendentList />} />

        <Route
          path="/product/:id"
          element={<ProductDetails onAddToCart={handleAddToCart} />}
        />
                <Route path="/ring/:id" element={<RingDetail />} />

<Route path="/pendant/:id" element={<PendantDetail />} />


        <Route path="/glasses/:id" element={<GlassDetails />} />
        <Route path="/shop/:id" element={<Shop />} />
        <Route path="/international-supply" element={<InternationalSupplyPage />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/asd-care" element={<ASDCare />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/cart" element={<CartPage />} />
        {/* Stripe Checkout success and cancel routes */}
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout" element={<CartCheckout />} />


      </Routes>
      <Footer />
    </Router>
  );
};

export default App;




  