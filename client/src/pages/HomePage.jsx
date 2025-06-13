// import React from "react";
// import Layout from "../components/shared/layout/Layout";
// // import first from "../assets/Hero-Content-Images/first-toppp.jpg";
// import second from "../assets/Hero-Content-Images/second.jpg";
// import third from "../assets/Hero-Content-Images/third.jpg";
// import registration from "../assets/Hero-Content-Images/registration.jpg";
// import healthScreening from "../assets/Hero-Content-Images/healthscreening.jpg";
// import donation from "../assets/Hero-Content-Images/donation.jpg";
// import impact from "../assets/Hero-Content-Images/impact.png";
// import { Link,useNavigate } from "react-router-dom";
// import { MdBloodtype } from "react-icons/md";
// const testimonials = [
//   {
//     quote: "Donating blood is a small act of kindness that saves lives.",
//     name: "Ravi Verma",
//   },
//   {
//     quote: "I feel proud every time I donate. It truly makes a difference.",
//     name: "Priya Sharma",
//   },
//   {
//     quote: "Emergency or not, your donation is someone's lifeline.",
//     name: "Amit Kapoor",
//   },
// ];

// const HomePage = () => {
//   const navigate=useNavigate();
//   return (
//     <>
//       <div className="bg-white text-black min-h-screen">
//         {/* LOGO + NAVBAR */}
//         <div className="flex items-center justify-between px-10 py-6 border-b border-red-600 bg-slate-900 text-white">
//           <div >
//              <a href="/" className="text-2xl font-bold text-red-500">
//                       <MdBloodtype/>
//                       BLOOD BANK <span className="text-white ml-3">APP</span>
//                     </a>
//           </div>
//           <nav className="space-x-6 text-lg">

//             <Link to="/nearby-hospitals" className="hover:text-red-500 transition">Nearby Hospitals</Link>
//             <Link to="/" className="hover:text-red-500 transition">Blood Inventory</Link>
//             <Link to="/" className="hover:text-red-500 transition">Emergency Request</Link>
//             {/* <a href="#" className="hover:text-red-500 transition">Login / Register</a> */}
//             <button
//   className="bg-red-600 text-white font-semibold px-6 py-3 rounded hover:bg-red-700 transition"
//   onClick={() => navigate("/login")}
// >
//   {/* Register to Donate or Request Blood */}
//   Register / Login
// </button>
//           </nav>
//         </div>

//           {/* SLIDING TESTIMONIALS */}
//       <div className="overflow-hidden mt-6 relative z-10">
//         <div className="animate-marquee whitespace-nowrap text-center text-xl text-red-300 font-semibold">
//           {testimonials.map((t, i) => (
//             <span key={i} className="mx-8 inline-block">
//               “{t.quote}” — {t.name}
//             </span>
//           ))}
//         </div>
//       </div>

//         {/* QUOTE + IMAGE SECTION */}
//         <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 mt-12 px-10">
//           <div>
//             <img src={second} alt="donor" className="rounded-lg border border-red-700 shadow-lg" />
//           </div>
//           <div>
//             <h1 className="text-4xl font-bold text-red-500 mb-4">
//               "Blood donation is the real act of humanity. It can save a life, it can save a family."
//             </h1>
//             <p className="text-lg text-gray-300">– Austin O'Malley</p>
//           </div>
//         </div>

//         {/* EXPLORE SECTION */}
//         <h2 className="text-2xl text-center mt-16 mb-4 text-red-600 font-bold underline">
//           Explore Blood Donation
//         </h2>
//         <div className="flex flex-col md:flex-row justify-around items-center px-10 gap-8">
//           <div className="flex-1">
//             <img src={third} alt="info" className="rounded-lg mb-4" />
//             <p className="text-center text-gray-300">
//               <code>
//                 After giving blood, your body begins the remarkable process of
//                 replenishing its supply. This renewal stimulates the production
//                 of fresh blood cells, promoting overall well-being and vitality.
//               </code>
//             </p>
//           </div>

//           {/* BLOOD MATRIX TABLE */}
//           <div className="bg-white text-black rounded-lg shadow-lg overflow-x-auto max-w-full">
//             <table className="table-auto text-sm md:text-base">
//               <thead>
//                 <tr>
//                   <th colSpan="3" className="bg-red-600 text-white font-bold py-2">Blood Type Compatibility Matrix</th>
//                 </tr>
//                 <tr className="bg-gray-100">
//                   <th className="px-3 py-2">Blood Type</th>
//                   <th className="px-3 py-2">Compatible Donors</th>
//                   <th className="px-3 py-2">Compatible Recipients</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {[
//                   ["A+", "A+, AB+", "A+, A-, O+, O-"],
//                   ["O+", "O+, A+, B+, AB+", "O+, O-"],
//                   ["B+", "B+, AB+", "B+, B-, O+, O-"],
//                   ["AB+", "AB+", "Everyone"],
//                   ["A-", "A+, A-, AB+, AB-", "A-, O-"],
//                   ["O-", "Everyone", "O-"],
//                   ["B-", "B+, B-, AB+, AB-", "B-, O-"],
//                   ["AB-", "AB+, AB-", "AB-, A-, B-, O-"],
//                 ].map(([type, donor, recipient]) => (
//                   <tr key={type} className="text-center border-t border-gray-300">
//                     <td className="px-3 py-2">{type}</td>
//                     <td className="px-3 py-2">{donor}</td>
//                     <td className="px-3 py-2">{recipient}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* BLOOD DONATION PROCESS */}
//         <h2 className="text-3xl text-center mt-16 mb-4 font-bold text-red-600 underline">Blood Donation Process</h2>
//         <div className="grid md:grid-cols-2 gap-8 px-10">
//           {[
//             {
//               title: "1 - Registration",
//               desc: "Donors provide essential information and medical history, ensuring eligibility and safety.",
//               img: registration,
//             },
//             {
//               title: "2 - Health Screening",
//               desc: "Vital checks are performed to ensure safe blood donation, like BP, hemoglobin, and travel history.",
//               img: healthScreening,
//             },
//             {
//               title: "3 - Donation",
//               desc: "A 10-15 minute process collecting one pint of blood under expert supervision.",
//               img: donation,
//             },
//             {
//               title: "4 - Impact",
//               desc: "Your donation is tested, stored, and used in critical medical cases, saving lives.",
//               img: impact,
//             },
//           ].map((step, i) => (
//             <div key={i} className="bg-white text-black rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 overflow-hidden">
//               <img src={step.img} alt={step.title} className="object-cover w-full h-48 md:h-full" />
//               <div className="p-4">
//                 <h3 className="font-bold text-lg text-red-600 mb-2">{step.title}</h3>
//                 <p>{step.desc}</p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* CONTACT US SECTION */}
//         <div className="bg-red-600 text-white text-center mt-20 py-10">
//           <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
//           <p className="text-lg">Phone: +91 90000 00000</p>
//           <p className="text-lg">Email: support@bloodbank.com</p>
//           <p className="text-lg">Address: 123 Blood Street, Life City, India</p>
//         </div>
//       </div>
//     </>
//   );
// };

// export default HomePage;
// HomePage.jsx

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdBloodtype } from "react-icons/md";
import second from "../assets/Hero-Content-Images/second.jpg";
import third from "../assets/Hero-Content-Images/third.jpg";
import registration from "../assets/Hero-Content-Images/registration.jpg";
import healthScreening from "../assets/Hero-Content-Images/healthscreening.jpg";
import donation from "../assets/Hero-Content-Images/donation.jpg";
import impact from "../assets/Hero-Content-Images/impact.png";
import EmergencyRequestModal from "../components/shared/modal/EmergencyRequestModal";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";


const testimonials = [
  {
    quote: "Donating blood is a small act of kindness that saves lives.",
    name: "Ravi Verma",
  },
  {
    quote: "I feel proud every time I donate. It truly makes a difference.",
    name: "Priya Sharma",
  },
  {
    quote: "Emergency or not, your donation is someone's lifeline.",
    name: "Amit Kapoor",
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="relative min-h-screen bg-gradient-to-tr from-black via-red-900 to-black text-white overflow-x-hidden">
      {/* BACKGROUND EFFECTS */}
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none overflow-hidden">
        <div className="absolute w-96 h-96 bg-red-400 opacity-10 rounded-full blur-3xl animate-pulse top-20 left-10"></div>
        <div className="absolute w-96 h-96 bg-red-600 opacity-10 rounded-full blur-2xl animate-ping top-60 right-10"></div>
      </div>

      {/* NAVBAR */}
      <div className="z-10 relative flex items-center justify-between px-10 py-6 border-b border-red-600 bg-black/60 backdrop-blur-lg">
        <div>
          <a
            href="/"
            className="text-2xl font-bold text-red-500 flex items-center gap-2"
          >
            <MdBloodtype className="text-3xl" /> BLOOD BANK{" "}
            <span className="text-white ml-3">APP</span>
          </a>
        </div>
        <nav className="space-x-6 text-lg">
          <Link
            to="/nearby-hospitals"
            className="hover:text-red-400 transition"
          >
            Nearby Hospitals
          </Link>
          <Link to="/public-inventory" className="hover:text-red-400 transition">
            Blood Inventory
          </Link>
     

         <motion.button
  onClick={() => setShowModal(true)}
  className="bg-red-600 text-white font-semibold py-1 px-4 rounded ml-4 shadow-md border border-white"
  animate={{ opacity: [1, 0.3, 1] }}
  transition={{ repeat: Infinity, duration: 1.5 }}
>
  🚨 Emergency Request
</motion.button>

          <button
            className="bg-red-600 text-white font-semibold px-6 py-3 rounded hover:bg-red-700 transition"
            onClick={() => navigate("/login")}
          >
            Register / Login
          </button>
        </nav>
      </div>
      

      {/* SLIDING TESTIMONIALS */}
      <div className="overflow-hidden mt-6 relative z-10">
        <div className="animate-marquee whitespace-nowrap text-center text-xl text-red-300 font-semibold">
          {testimonials.map((t, i) => (
            <span key={i} className="mx-8 inline-block">
              “{t.quote}” — {t.name}
            </span>
          ))}
        </div>
      </div>

      {/* QUOTE SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 mt-12 px-10 z-10 relative">
        <div className="animate-fadeInUp">
          <img
            src={second}
            alt="donor"
            className="rounded-lg border border-red-700 shadow-xl"
          />
        </div>
        <div className="animate-fadeInRight">
          <h1 className="text-4xl font-bold text-red-400 mb-4 tracking-tight leading-snug">
            "Blood donation is the real act of humanity. It can save a life, it
            can save a family."
          </h1>
          <p className="text-lg text-gray-200">– Austin O'Malley</p>
        </div>
      </div>
    {/* VISION, MISSION, CORE VALUES */}
<div className="text-white text-center mt-20 px-6 md:px-20 z-10 relative">
  <h2 className="text-3xl font-bold mb-4 text-red-400">Our Vision, Mission and Core Values</h2>
  <div className="w-24 h-1 bg-red-600 mx-auto mb-10"></div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
    <div className="bg-black/60 p-6 rounded-lg shadow-lg border border-red-800">
      <h6 className="text-xl font-semibold text-red-500 mb-2">Our Vision</h6>
      <p className="text-gray-300">
        Our vision is to create a world where no one has to suffer or lose a life due to the shortage of blood.
        We strive to build a smart, responsive, and accessible blood bank management system that bridges the
        gap between donors and recipients.
      </p>
    </div>
    <div className="bg-black/60 p-6 rounded-lg shadow-lg border border-red-800">
      <h6 className="text-xl font-semibold text-red-500 mb-2">Our Mission</h6>
      <p className="text-gray-300">
        To ensure timely and safe blood availability by streamlining donation, screening, and distribution through
        technology. We aim to empower communities and foster a culture of life-saving blood donation.
      </p>
    </div>
    <div className="bg-black/60 p-6 rounded-lg shadow-lg border border-red-800">
      <h6 className="text-xl font-semibold text-red-500 mb-2">Core Values</h6>
      <p className="text-gray-300">
        Compassion, Transparency, Accountability, and Innovation guide our every effort. We value every donor and
        every drop, working with integrity to serve those in need.
      </p>
    </div>
  </div>
</div>

      {/* EXPLORE SECTION */}
      <h2 className="text-2xl text-center mt-16 mb-6 text-red-500 font-bold underline tracking-wide z-10 relative">
        Explore Blood Donation
      </h2>
      <div className="flex flex-col md:flex-row justify-around items-center px-10 gap-8 z-10 relative">
        <div className="flex-1 animate-fadeInLeft">
          <img src={third} alt="info" className="rounded-lg mb-4 shadow-lg" />
          <p className="text-center text-gray-300">
            <code>
              After giving blood, your body begins the remarkable process of
              replenishing its supply. This renewal stimulates the production of
              fresh blood cells, promoting overall well-being and vitality.
            </code>
          </p>
        </div>

        {/* BLOOD MATRIX TABLE */}
        <div className="bg-white text-black rounded-lg shadow-lg overflow-x-auto max-w-full animate-fadeInRight">
          <table className="table-auto text-sm md:text-base">
            <thead>
              <tr>
                <th
                  colSpan="3"
                  className="bg-red-600 text-white font-bold py-2"
                >
                  Blood Type Compatibility Matrix
                </th>
              </tr>
              <tr className="bg-gray-100">
                <th className="px-3 py-2">Blood Type</th>
                <th className="px-3 py-2">Compatible Donors</th>
                <th className="px-3 py-2">Compatible Recipients</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["A+", "A+, AB+", "A+, A-, O+, O-"],
                ["O+", "O+, A+, B+, AB+", "O+, O-"],
                ["B+", "B+, AB+", "B+, B-, O+, O-"],
                ["AB+", "AB+", "Everyone"],
                ["A-", "A+, A-, AB+, AB-", "A-, O-"],
                ["O-", "Everyone", "O-"],
                ["B-", "B+, B-, AB+, AB-", "B-, O-"],
                ["AB-", "AB+, AB-", "AB-, A-, B-, O-"],
              ].map(([type, donor, recipient]) => (
                <tr key={type} className="text-center border-t border-gray-300">
                  <td className="px-3 py-2">{type}</td>
                  <td className="px-3 py-2">{donor}</td>
                  <td className="px-3 py-2">{recipient}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* BLOOD DONATION PROCESS */}
      <h2 className="text-3xl text-center mt-20 mb-6 font-bold text-red-400 underline tracking-wide z-10 relative">
        Blood Donation Process
      </h2>
      <div className="grid md:grid-cols-2 gap-8 px-10 z-10 relative">
        {[
          {
            title: "1 - Registration",
            desc: "Donors provide essential information and medical history, ensuring eligibility and safety.",
            img: registration,
          },
          {
            title: "2 - Health Screening",
            desc: "Vital checks are performed to ensure safe blood donation, like BP, hemoglobin, and travel history.",
            img: healthScreening,
          },
          {
            title: "3 - Donation",
            desc: "A 10-15 minute process collecting one pint of blood under expert supervision.",
            img: donation,
          },
          {
            title: "4 - Impact",
            desc: "Your donation is tested, stored, and used in critical medical cases, saving lives.",
            img: impact,
          },
        ].map((step, i) => (
          <div
            key={i}
            className="bg-white text-black rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 overflow-hidden animate-fadeInUp"
          >
            <img
              src={step.img}
              alt={step.title}
              className="object-cover w-full h-48 md:h-full"
            />
            <div className="p-4">
              <h3 className="font-bold text-lg text-red-600 mb-2">
                {step.title}
              </h3>
              <p>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CONTACT US */}
{/* CONTACT + FOOTER SECTION */}
<footer className="bg-gradient-to-t from-black via-red-900 to-black text-white pt-12 px-6 md:px-20 z-10 relative" id="contact">
  <div className="grid md:grid-cols-2 gap-10">
    {/* Contact Info */}
    <div>
      <h2 className="text-3xl font-bold text-red-500 mb-4">Contact Us</h2>
      <p className="mb-2 text-lg">📞 Phone: +91 98765 43210</p>
      <p className="mb-2 text-lg">✉️ Email: apnabloodbank.noreply@gmail.com</p>
      <p className="mb-4 text-lg">📍 Address: 123 Lifeline Street, RedCity, India</p>

      {/* Social Media */}
      <div className="flex gap-6 mt-6 text-2xl">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-400">
          <FaFacebook />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-400">
          <FaInstagram />
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-400">
          <FaLinkedin />
        </a>
      </div>
    </div>

    {/* Contact Form */}
    <form
      onSubmit={(e) => {
        e.preventDefault();
        alert("Message sent! We'll contact you shortly.");
      }}
      className="bg-white text-black p-6 rounded-xl shadow-lg space-y-4"
    >
      <h3 className="text-2xl font-bold text-center text-red-600 mb-2">Send Us a Message</h3>
      <input
        type="text"
        placeholder="Your Name"
        required
        className="w-full p-2 border border-red-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
      />
      <input
        type="email"
        placeholder="Your Email"
        required
        className="w-full p-2 border border-red-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
      />
      <textarea
        rows="4"
        placeholder="Your Message"
        required
        className="w-full p-2 border border-red-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
      />
      <button
        type="submit"
        className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
      >
        Send Message
      </button>
    </form>
  </div>

  {/* Footer Bottom */}
  <div className="mt-12 border-t border-red-700 pt-6 text-center text-sm text-gray-300">
    &copy; {new Date().getFullYear()} Blood Bank App. All rights reserved.
  </div>
</footer>



         {showModal && <EmergencyRequestModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default HomePage;
