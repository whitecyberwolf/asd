import React from "react";

const TermsOfService = () => {
  return (
    <div className="bg-[#fdfbf8] text-black">
      {/* Hero Section */}
      <div
        className="relative w-full h-[450px] bg-cover bg-center"
        style={{ backgroundImage: "url('/images/terms-of-service.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center px-8 sm:px-16">
          <h1 className="text-white text-xl sm:text-3xl font-semibold uppercase tracking-wider">
            HOME &gt; TERMS OF SERVICE
          </h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-screen-lg mx-auto px-8 py-14">
        {/* Overview */}
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 uppercase tracking-wide">Overview</h2>
        <p className="text-lg leading-loose mb-6">
          This website is operated by Aprilshine Diamond. By using this website, you agree to comply with our Terms of Service, which apply to all users. If you disagree with any part of this agreement, you cannot access the website or use our services.
        </p>

        {/* Sections */}
        {[
          {
            title: "Online Store Terms",
            content: "By agreeing to these Terms of Service, you confirm that you are of legal age in your state or province, or that you have permission for any minor dependents to use this site. You may not use our products for illegal purposes or violate any laws in your jurisdiction.",
          },
          {
            title: "General Conditions",
            content: "We reserve the right to refuse service to anyone at any time. Your information (excluding credit card data) may be transferred unencrypted across networks. You agree not to reproduce or exploit any part of the Service without our written permission.",
          },
          {
            title: "Accuracy, Completeness, and Timeliness of Information",
            content: "We are not responsible for inaccuracies on this site. The material provided is for general information only and should not be your sole basis for decisions.",
          },
          {
            title: "Modifications to the Service and Prices",
            content: "Product prices may change without notice. We can modify or discontinue any part of the Service at any time without liability to you or third parties.",
          },
          {
            title: "Products or Services",
            content: "Certain products may only be available online and are subject to our Refund Policy. We strive to display products accurately, but we cannot guarantee color accuracy on all monitors.",
          },
          {
            title: "Accuracy of Billing and Account Information",
            content: "We may refuse any order and can limit purchases per person or household. If we change or cancel an order, we will notify you using the contact information provided.",
          },
          {
            title: "Third-Party Services & Links",
            content: "We may provide access to third-party tools and links. We are not responsible for their content or accuracy and do not monitor these external sites.",
          },
          {
            title: "User Comments & Submissions",
            content: "If you submit comments or suggestions, you agree that we can use them freely without any obligation to maintain confidentiality or compensate you.",
          },
          {
            title: "Personal Information",
            content: "Your submission of personal information is governed by our Privacy Policy, which can be viewed here: [LINK TO PRIVACY POLICY].",
          },
          {
            title: "Errors, Inaccuracies, and Omissions",
            content: "We reserve the right to correct errors, update information, or cancel orders at any time without prior notice.",
          },
          {
            title: "Prohibited Uses",
            content: "You may not use our site for unlawful purposes, to solicit illegal activities, or to violate any laws. Violations may result in termination of your access to the Service.",
          },
          {
            title: "Disclaimer of Warranties; Limitation of Liability",
            content: "We do not guarantee that our Service will be uninterrupted or error-free. We are not liable for any damages arising from your use of the Service.",
          },
          {
            title: "Indemnification",
            content: "You agree to indemnify and hold harmless Aprilshine Diamond from any claims or demands arising from your breach of these Terms.",
          },
          {
            title: "Severability",
            content: "If any provision of these Terms is deemed unlawful or unenforceable, that provision will be severed, and the remaining Terms will remain in effect.",
          },
          {
            title: "Termination",
            content: "These Terms remain effective until terminated by either party. You may terminate by ceasing use of the Service. We may terminate if you fail to comply with any term.",
          },
          {
            title: "Entire Agreement",
            content: "These Terms, along with any posted policies, represent the entire agreement between you and us, superseding any prior agreements.",
          },
          {
            title: "Governing Law",
            content: "These Terms will be governed by the laws of Hong Kong.",
          },
          {
            title: "Changes to Terms of Service",
            content: "We may update these Terms at our discretion. Continued use of our Service signifies acceptance of any updates.",
          },
        ].map((section, index) => (
          <div key={index} className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 uppercase tracking-wide">{section.title}</h2>
            <p className="text-lg leading-loose">{section.content}</p>
          </div>
        ))}

        {/* Contact Information */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 uppercase tracking-wide">Contact Information</h2>
          <p className="text-lg leading-loose">
            If you have any questions about our Terms of Service, please contact us at:
          </p>
          <p className="text-lg leading-loose mt-2">
            📍 Hong Kong <br />
            📞 +852 9684 5389 <br />
            ✉️ <a href="mailto:aprilshined@gmail.com" className="text-blue-600 hover:underline">aprilshined@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
