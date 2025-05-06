// src/App.jsx

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout
import NavBar   from "./component/navbar";
import Footer   from "./component/Footer";

// Pages
import HomePage                 from "./pages/Home";
import PersonalizedPage         from "./pages/PersonalizedPage";
import AboutUs                  from "./pages/AboutUs";
import ASDCare                  from "./pages/ASDCare";
import InternationalSupplyPage  from "./pages/InternationalSupplypage";
import TermsOfService           from "./pages/TermsOfService";
import CartPage                 from "./pages/CartPage";
import Success                  from "./pages/Success";
import Cancel                   from "./pages/Cancel";
import BlogSection              from "./pages/blog/BlogSection";
import BlogPost                 from "./pages/blog/BlogPost";
import Checkout                 from "./pages/Checkout";

// Cart-drawer
import CartCheckout             from "./component/navbar/CartCheckout";

// // Product Listings
// import MenWatchList             from "./component/Product/MenWatchList";
// import WomenWatchList           from "./component/Product/WomenWatchList";
// import MensBraceletPage         from "./component/Product/MensBraceletPage";

// // Chain Listings
// import MenChainList             from "./pages/chains/MenChainList";
// import WomenChainList           from "./pages/chains/WomenChainList";

// // Detail pages
// import ProductDetail            from "./pages/ProductDetail";
// import ChainDetail              from "./pages/chains/ChainDetail";


// Product Listings
// import ChainsList               from "./component/Product/ChainsList";


import MenWatchList             from "./component/Product/MenWatchList";
import WomenWatchList           from "./component/Product/WomenWatchList";
import MensBraceletPage         from "./component/Product/MensBraceletPage";

import MenChainList             from "./component/Product/MenChainList";
import WomenChainList         from "./component/Product/WomenChainList";

// Product Detail (single component handles both categories)
import ProductDetail            from "./component/Product/ProductDetails";
import ChainDetail              from "./component/Product/ChainDetail"; 

import ComingSoon           from "./pages/ComingSoon";

// Firebase + Firestore
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

function App() {
  const [cartItems, setCartItems] = useState([]);

  const auth = getAuth();
  const db   = getFirestore();

  // Load cart on auth change
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const cartRef  = doc(db, "carts", user.uid);
        const cartSnap = await getDoc(cartRef);
        if (cartSnap.exists()) {
          setCartItems(cartSnap.data().items || []);
        } else {
          await setDoc(cartRef, { items: [] });
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    });
    return unsub;
  }, [auth, db]);

  // Persist cart on change
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

        {/* Coming Soon Page */}
        <Route path="/coming-soon" element={<ComingSoon />} />
        {/* Landing & Static Pages */}
        <Route path="/"                    element={<HomePage />} />
        <Route path="/personalized"        element={<PersonalizedPage />} />
        <Route path="/about-us"            element={<AboutUs />} />
        <Route path="/asd-care"            element={<ASDCare />} />
        <Route path="/international-supply" element={<InternationalSupplyPage />} />
        <Route path="/terms-of-service"    element={<TermsOfService />} />
        <Route path="/blog"                element={<BlogSection />} />
        <Route path="/blog/:id"            element={<BlogPost />} />

        {/* Watch Listings */}
        <Route path="/men"                 element={<MenWatchList />} />
        <Route path="/women"               element={<WomenWatchList />} />

        {/* Watch Details */}
        <Route path="/men/:id"             element={<ProductDetail category="men" />} />
        <Route path="/women/:id"           element={<ProductDetail category="women" />} />

        {/* Chain Listings */}
        <Route path="/men/chains"          element={<MenChainList />} />
        <Route path="/women/chains"        element={<WomenChainList />} />

        {/* Chain Details */}
        <Route path="/men/chains/:id"      element={<ChainDetail />} />
        <Route path="/women/chains/:id"    element={<ChainDetail />} />

        {/* Bracelet */}
        <Route path="/mens-bracelet"       element={<MensBraceletPage />} />

        {/* Cart & Checkout */}
        <Route path="/cart"                element={<CartPage />} />
        <Route path="/checkout"            element={<Checkout />} />
        <Route path="/cart-checkout"       element={<CartCheckout />} />

        {/* Stripe webhook returns */}
        <Route path="/success"             element={<Success />} />
        <Route path="/cancel"              element={<Cancel />} />

        {/* (Optional) 404 fallback */}
        {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
