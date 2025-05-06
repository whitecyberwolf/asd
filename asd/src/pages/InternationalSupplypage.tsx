import React from "react";

const InternationalSupply = () => {
  return (
    <div className="bg-[#ffffff] text-black">
      {/* Hero Section */}
      <div className="relative w-full h-[400px] bg-cover bg-center" style={{ backgroundImage: "url('/images/international-supply.jpg')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center px-6 sm:px-10">
          <h1 className="text-white text-lg sm:text-2xl font-semibold">HOME &gt; INTERNATIONAL SUPPLY</h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-screen-lg mx-auto px-6 py-10">
        {/* Shipping Charges Table */}
        <h2 className="text-xl sm:text-2xl font-bold mb-6">WHAT ARE THE SHIPPING CHARGES ON INTERNATIONAL ORDERS?</h2>
        
        <div className="border border-gray-300 rounded-md overflow-hidden">
          <table className="w-full border-collapse text-sm sm:text-base">
            <tbody>
              <tr className="border-b border-gray-300">
                <td className="p-4 font-semibold bg-gray-100 w-1/4">Country</td>
                <td className="p-4">Hong Kong</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="p-4 font-semibold bg-gray-100">Shipping Cost</td>
                <td className="p-4">Free</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="p-4 font-semibold bg-gray-100">Only Cost</td>
                <td className="p-4">If the order is placed for express delivery.</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold bg-gray-100">Other Countries</td>
                <td className="p-4">
                  Australia, Bangladesh, Belgium, Canada, Switzerland, Cyprus, Czech Republic, Germany, Denmark, Estonia, Spain, Finland, France,
                  United Kingdom, Greece, Hong Kong, Croatia, Hungary, Indonesia, Ireland, Israel, Iceland, Italy, Japan, South Korea, Lebanon, Sri Lanka,
                  Lithuania, Luxembourg, Latvia, Malta, Maldives, Malaysia, Netherlands, Norway, New Zealand, Philippines, Poland, Portugal, Romania,
                  Serbia, Saudi Arabia, Sweden, Singapore, Slovenia, Slovakia, Thailand, Turkey, Taiwan, China, United States, United Arab Emirates,
                  Bahrain, Kuwait, Oman, and Qatar.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Additional Information Sections */}
        <div className="mt-10 space-y-8">
          {/* International Duties and Taxes */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">UNDERSTANDING INTERNATIONAL DUTIES AND TAXES</h2>
            <p className="text-sm sm:text-base mt-2">
              Shipping costs include all applicable duties and taxes. If you're asked to pay extra charges upon delivery, please reach out to us at 
              <a href="mailto:aprilshined@gmail.com" className="text-blue-600 hover:underline"> aprilshined@gmail.com</a>.
            </p>
          </div>

          {/* Payment Options */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">PAYMENT OPTIONS AT ASD</h2>
            <p className="text-sm sm:text-base mt-2">
              We accept various payment methods, including credit cards, debit cards, UPI, and PayPal.
            </p>
          </div>

          {/* Cancellation Policy */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">CAN I CANCEL MY INTERNATIONAL ORDER?</h2>
            <p className="text-sm sm:text-base mt-2">
              Unfortunately, international orders cannot be canceled once placed. However, we may consider cancellation requests at our discretion.
            </p>
          </div>

          {/* Return Policy */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">RETURN POLICY</h2>
            <p className="text-sm sm:text-base mt-2">
              You can return your jewelry within 30 days of delivery. To be eligible for a return, the item must be unused and returned with the original 
              invoice and packaging. Please send the product, packaging, and invoice to:
            </p>
            <div className="bg-gray-100 p-4 mt-2 rounded-md text-sm sm:text-base">
              <p>1902-F, Grandtek Center,</p>
              <p>No.8 On Ping Street, Shatin,</p>
              <p>N.T., Hong Kong.</p>
            </div>
            <p className="text-sm sm:text-base mt-2">
              After our quality check, refunds will be processed within 15 days, minus any applicable fees and duties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternationalSupply;
