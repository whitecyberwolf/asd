// src/component/PersonalizedContent.tsx

import React, { useState } from "react";
import { db } from "../../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

// Helper function: basic email validation regex
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const PersonalizedContent: React.FC = () => {
  // Form field state
  const [gender, setGender] = useState<string>("Female");
  const [type, setType] = useState<string>("Bracelet");
  const [metalType, setMetalType] = useState<string>("Rose Gold");
  const [budget, setBudget] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [contactName, setContactName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  
  // File upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  
  // Submission status & errors
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);

  // Firebase Storage instance
  const storage = getStorage();

  // Handle file input changes
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // Form validation: check required fields and rules
  const validateForm = (): boolean => {
    const newErrors: string[] = [];
    if (!gender) newErrors.push("Gender is required.");
    if (!type) newErrors.push("Jewelry type is required.");
    if (!metalType) newErrors.push("Metal type is required.");
    if (!budget) {
      newErrors.push("Budget is required.");
    } else if (isNaN(Number(budget)) || Number(budget) <= 0) {
      newErrors.push("Budget must be a number greater than zero.");
    }
    if (!description) newErrors.push("Description is required.");
    if (!contactName) newErrors.push("Contact name is required.");
    if (!email) {
      newErrors.push("Email is required.");
    } else if (!validateEmail(email)) {
      newErrors.push("Email format is invalid.");
    }
    if (!contact) newErrors.push("Contact number is required.");
    // Optionally, you can add further validations on the contact number.

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitSuccess(false);
    setSubmitError("");
    setErrors([]);

    // Validate fields; if invalid, abort submission
    if (!validateForm()) return;

    try {
      let imageUrl = "";
      if (imageFile) {
        // Upload image to Firebase Storage
        const storageRef = ref(
          storage,
          `personalizedRequests/${Date.now()}_${imageFile.name}`
        );
        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            },
            (error) => {
              console.error("Image upload error:", error);
              reject(error);
            },
            async () => {
              imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      }

      // Create data object
      const requestData = {
        gender,
        type,
        metalType,
        budget,
        description,
        contactName,
        email,
        contact,
        imageUrl,
        submittedAt: new Date(),
      };

      // Add the document to Firestore collection "personalizedRequests"
      await addDoc(collection(db, "personalizedRequests"), requestData);

      setSubmitSuccess(true);
      // Reset form fields
      setGender("Female");
      setType("Bracelet");
      setMetalType("Rose Gold");
      setBudget("");
      setDescription("");
      setContactName("");
      setEmail("");
      setContact("");
      setImageFile(null);
      setUploadProgress(0);
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitError("Failed to submit your request. Please try again.");
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
      {/* Left Column - Past Projects */}
      <div className="col-span-2">
        <h2 className="text-2xl font-bold mb-6">PAST PROJECTS</h2>
        <p className="text-gray-600 mb-8">
          At ASD Jewellery, we believe that every piece of jewelry should tell
          a unique story of yours. Our works speak quality and here are some
          masterpieces created by us, with the vision of our clients.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Example Project Cards */}
          <div className="text-center">
            <img
              src="/images/project1.jpg"
              alt="Customized Diamond Name"
              className="w-full h-60 object-cover rounded-lg mb-4"
            />
            <p className="text-sm text-gray-500">APRILSHINE DIAMOND</p>
            <h3 className="font-semibold">Customized Diamond Name</h3>
            <p className="text-[#9c7a56] font-bold">$ 85,400.00</p>
          </div>
          <div className="text-center">
            <img
              src="/images/project2.jpg"
              alt="AP Moissanite Diamond Watch"
              className="w-full h-60 object-cover rounded-lg mb-4"
            />
            <p className="text-sm text-gray-500">APRILSHINE DIAMOND</p>
            <h3 className="font-semibold">AP Moissanite Diamond Watch</h3>
            <p className="text-[#9c7a56] font-bold">$ 76,000.00</p>
          </div>
          <div className="text-center">
            <img
              src="/images/project3.jpg"
              alt="Moissanite Diamond Braces"
              className="w-full h-60 object-cover rounded-lg mb-4"
            />
            <p className="text-sm text-gray-500">APRILSHINE DIAMOND</p>
            <h3 className="font-semibold">Moissanite Diamond Braces</h3>
            <p className="text-[#9c7a56] font-bold">$ 84,600.00</p>
          </div>
          <div className="text-center">
            <img
              src="/images/project4.jpg"
              alt="Fancy Green Diamond Ring"
              className="w-full h-60 object-cover rounded-lg mb-4"
            />
            <p className="text-sm text-gray-500">APRILSHINE DIAMOND</p>
            <h3 className="font-semibold">Fancy Green Diamond Ring</h3>
            <p className="text-[#9c7a56] font-bold">$ 170,700.00</p>
          </div>
        </div>

        {/* What We Offer Section */}
        <h3 className="text-xl font-bold mt-12 mb-4">WHAT WE OFFER</h3>
        <div className="grid grid-cols-2 text-sm text-gray-600 gap-4">
          <ul>
            <li>• Jewellery Material</li>
            <li className="ml-4">- Gold</li>
            <li className="ml-4">- Sterling Silver 925</li>
          </ul>
          <ul>
            <li>• Natural Gemstone</li>
            <li className="ml-4">- Color</li>
            <li className="ml-4">- Pearl</li>
          </ul>
          <ul>
            <li>• Natural Diamonds</li>
            <li className="ml-4">- Moissanite Diamond</li>
            <li className="ml-4">- Lab Diamond</li>
            <li className="ml-4">- Real Dual Diamond</li>
          </ul>
          <ul>
            <li>• Gold Purity</li>
            <li className="ml-4">- 10k</li>
            <li className="ml-4">- 14k</li>
            <li className="ml-4">- 18k</li>
          </ul>
        </div>
      </div>

      {/* Right Column - Form */}
      <div>
        <h2 className="text-2xl font-bold mb-6">
          Create your own exclusive jewellery style
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Tell us about how you would like to create your jewellery
        </p>

        {/* Display Validation Errors */}
        {errors.length > 0 && (
          <div className="mb-4 p-4 border border-red-400 text-red-600 rounded">
            <ul>
              {errors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Gender */}
          <div>
            <label htmlFor="gender" className="block text-sm text-gray-600 mb-1">
              Gender
            </label>
            <select
              id="gender"
              className="w-full px-4 py-2 border rounded-md focus:ring-[#9c7a56] focus:outline-none"
              title="Select your gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option>Female</option>
              <option>Male</option>
              <option>Other</option>
            </select>
          </div>

          {/* Type */}
          <div>
            <label htmlFor="type" className="block text-sm text-gray-600 mb-1">
              Type
            </label>
            <select
              id="type"
              className="w-full px-4 py-2 border rounded-md focus:ring-[#9c7a56] focus:outline-none"
              title="Select the type of jewelry"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option>Bracelet</option>
              <option>Ring</option>
              <option>Necklace</option>
              <option>Earrings</option>
            </select>
          </div>

          {/* Metal Type */}
          <div>
            <label htmlFor="metalType" className="block text-sm text-gray-600 mb-1">
              Metal Type
            </label>
            <select
              id="metalType"
              className="w-full px-4 py-2 border rounded-md focus:ring-[#9c7a56] focus:outline-none"
              title="Select the metal type"
              value={metalType}
              onChange={(e) => setMetalType(e.target.value)}
            >
              <option>Rose Gold</option>
              <option>Yellow Gold</option>
              <option>White Gold</option>
              <option>Platinum</option>
            </select>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              What is your Budget?
            </label>
            <input
              type="text"
              placeholder="$ 20,000"
              className="w-full px-4 py-2 border rounded-md focus:ring-[#9c7a56] focus:outline-none"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Description
            </label>
            <textarea
              placeholder="I want a beautiful & perfect piece..."
              className="w-full px-4 py-2 border rounded-md focus:ring-[#9c7a56] focus:outline-none"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* Upload Image */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full"
              onChange={handleImageChange}
              title="Upload an image for your design"
            />
          </div>

          {/* Contact Information */}
          <h3 className="text-lg font-semibold mt-8 mb-4">
            What's the best way to reach you?
          </h3>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Name</label>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-2 border rounded-md focus:ring-[#9c7a56] focus:outline-none"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-2 border rounded-md focus:ring-[#9c7a56] focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Contact</label>
            <input
              type="text"
              placeholder="Your Contact Number"
              className="w-full px-4 py-2 border rounded-md focus:ring-[#9c7a56] focus:outline-none"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 mt-4 bg-[#9c7a56] text-white font-bold rounded-md hover:bg-[#b2996e] transition"
          >
            Let's Begin
          </button>
          {uploadProgress > 0 && (
            <p className="text-sm text-gray-600">
              Upload Progress: {uploadProgress.toFixed(0)}%
            </p>
          )}
          {submitSuccess && (
            <p className="text-sm text-green-600">
              Request submitted successfully!
            </p>
          )}
          {submitError && <p className="text-sm text-red-600">{submitError}</p>}
        </form>
      </div>
    </div>
  );
};

export default PersonalizedContent;
