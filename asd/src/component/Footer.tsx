import React from "react";
import { FaFacebookF, FaPinterestP, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#f9f4ef] text-black">
      {/* Top Section */}
      <div className="max-w-screen-xl mx-auto px-8 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-14 md:gap-20 items-start">
        {/* Join the Community */}
        <div className="flex flex-col">
          <h3 className="text-lg font-bold mb-4">JOIN THE COMMUNITY</h3>
          <p className="text-sm mb-4">
            Sign up for exclusive sales, fresh launches, style advice, and more!
          </p>
          <form className="flex w-full max-w-[250px]">
  <input
    type="email"
    placeholder="Email"
    className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#9c7a56]"
  />
  <button
    type="submit"
    className="px-1 py-2 bg-black text-white rounded-r-md hover:bg-[#333] transition"
  >
    Subscribe
  </button>
</form>

        </div>

        {/* New Menu */}
        <div className="flex flex-col">
          <h3 className="text-lg font-bold mb-4">NEW MENU</h3>
          <ul className="space-y-3">
            <li><a href="#men" className="text-sm hover:underline">Men's</a></li>
            <li><a href="#women" className="text-sm hover:underline">Women's</a></li>
            <li><a href="#personalized" className="text-sm hover:underline">Personalized</a></li>
            <li><a href="#blogs" className="text-sm hover:underline">Blogs</a></li>
            <li><a href="/asd-care" className="text-sm hover:underline">More at ASD</a></li>
          </ul>
        </div>

        {/* Company Info */}
        <div className="flex flex-col">
  <h3 className="text-lg font-bold mb-4">COMPANY INFO</h3>
  <ul className="space-y-3">
    <li><a href="/about-us" className="text-sm hover:underline">About Us</a></li>
    <li><a href="/international-supply" className="text-sm hover:underline">International Supply</a></li>
    <li><a href="#privacy-policy" className="text-sm hover:underline">Privacy Policy</a></li>
    <li><a href="/terms-of-service" className="text-sm hover:underline">Terms of Service</a></li>
  </ul>
</div>


        {/* Customer Service */}
        <div className="flex flex-col">
          <h3 className="text-lg font-bold mb-4">CUSTOMER SERVICE</h3>
          <ul className="space-y-3">
            <li><a href="#track-order" className="text-sm hover:underline">Track Your Order</a></li>
            <li><a href="#shipping-policy" className="text-sm hover:underline">Shipping Policy</a></li>
            <li><a href="#return-policy" className="text-sm hover:underline">Return & Exchange Policy</a></li>
            <li><a href="#refund-policy" className="text-sm hover:underline">Refund Policy</a></li>
            <li><a href="#faq" className="text-sm hover:underline">FAQ</a></li>
          </ul>
        </div>

        {/* Contact Us */}
        <div className="flex flex-col">
          <h3 className="text-lg font-bold mb-4">CONTACT US</h3>
          <ul className="space-y-3">
            <li className="text-sm">📍 Hong Kong</li>
            <li className="text-sm">📞 +852 9684 5389</li>
            <li className="text-sm">✉️ aprilshined@gmail.com</li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-black text-white py-6">
        <div className="max-w-screen-xl mx-auto px-8 flex flex-col sm:flex-row items-center justify-between space-y-6 sm:space-y-0">
          {/* Social Icons */}
          <div className="flex space-x-6">
            <a href="#facebook" className="text-white hover:text-gray-400"><FaFacebookF /></a>
            <a href="#pinterest" className="text-white hover:text-gray-400"><FaPinterestP /></a>
            <a href="#instagram" className="text-white hover:text-gray-400"><FaInstagram /></a>
            <a href="#youtube" className="text-white hover:text-gray-400"><FaYoutube /></a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-center">
            © 2024 - APRILSHINE. All rights reserved.
          </p>

          {/* Payment Icons */}
          <div className="flex space-x-6">
            <img src="/images/payment-amex.png" alt="Amex" className="h-7" />
            <img src="/images/payment-apple.png" alt="Apple Pay" className="h-7" />
            <img src="/images/payment-google.png" alt="Google Pay" className="h-7" />
            <img src="/images/payment-shop.png" alt="Shop Pay" className="h-7" />
            <img src="/images/payment-visa.png" alt="Visa" className="h-7" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
