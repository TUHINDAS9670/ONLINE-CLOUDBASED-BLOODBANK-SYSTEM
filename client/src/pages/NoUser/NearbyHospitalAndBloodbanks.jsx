// // src/pages/NearbyHospitals.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import API from "../../services/API";

// const GEOAPIFY_API_KEY = "8d0eb3ec69ac476aa662a19f59744fbc";

// const NearbyHospitals = () => {
//   const [nearbyHospitals, setNearbyHospitals] = useState([]);
//   const [nearbyBloodBanks, setNearbyBloodBanks] = useState([]);
//   const [registeredHospitals, setRegisteredHospitals] = useState([]);

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         const { latitude, longitude } = position.coords;
//         console.log("Latitude:", latitude, "Longitude:", longitude);

//         const url = `https://api.geoapify.com/v2/places?categories=healthcare.hospital,healthcare,healthcare.clinic_or_praxis&bias=proximity:${longitude},${latitude}&limit=20&apiKey=${GEOAPIFY_API_KEY}`;

//         console.log("Geoapify URL:", url);

//         try {
//           const response = await axios.get(url);
//           const allPlaces = response.data.features;

//           // Separate into hospitals and blood banks
//           const hospitals = [];
//           const bloodBanks = [];

//           allPlaces.forEach((place) => {
//             const name = place.properties.name?.toLowerCase() || "";
//             if (name.includes("blood") || name.includes("blood bank")) {
//               bloodBanks.push(place);
//             } else {
//               hospitals.push(place);
//             }
//           });

//           setNearbyHospitals(hospitals);
//           setNearbyBloodBanks(bloodBanks);
//         } catch (err) {
//           console.error("Geoapify fetch error:", err);
//         }
//       },
//       (error) => {
//         console.error("Geolocation error:", error);
//       }
//     );

//     // Fetch hospitals/organisations from your backend
//     const fetchRegistered = async () => {
//       try {
//         const { data } = await API.get("/hospital-org/list");
//         console.log(data);
//         setRegisteredHospitals(data?.hospitals || []);
//       } catch (err) {
//         console.log("Error fetching registered hospitals:", err);
//       }
//     };

//     fetchRegistered();
//   }, []);

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold text-red-600 mb-6">Nearby Hospitals & Blood Banks</h1>

//       {/* Real-time Nearby Hospitals */}
//       <div className="mb-10">
//         <h2 className="text-xl font-semibold text-gray-700 mb-3">Nearby Hospitals</h2>
//         {nearbyHospitals.length ? (
//           <ul className="space-y-4">
//             {nearbyHospitals.map((place, idx) => (
//               <li key={idx} className="border p-4 rounded shadow bg-white">
//                 <h3 className="text-lg font-bold">{place.properties.name || "Unnamed Facility"}</h3>
//                 <p>Address: {place.properties.formatted}</p>
//                 <p>Type: {place.properties.categories?.join(", ")}</p>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className="text-gray-500">Fetching nearby hospitals...</p>
//         )}
//       </div>

//       {/* Real-time Nearby Blood Banks */}
//       <div className="mb-10">
//         <h2 className="text-xl font-semibold text-gray-700 mb-3">Nearby Blood Banks (Detected)</h2>
//         {nearbyBloodBanks.length ? (
//           <ul className="space-y-4">
//             {nearbyBloodBanks.map((place, idx) => (
//               <li key={idx} className="border p-4 rounded shadow bg-white">
//                 <h3 className="text-lg font-bold">{place.properties.name || "Unnamed Facility"}</h3>
//                 <p>Address: {place.properties.formatted}</p>
//                 <p>Type: {place.properties.categories?.join(", ")}</p>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className="text-gray-500">No dedicated blood banks found nearby — filtering from general facilities.</p>
//         )}
//       </div>

//       {/* Registered facilities from your database */}
//       <div>
//         <h2 className="text-xl font-semibold text-gray-700 mb-3">Registered Facilities in Our System</h2>
//         {registeredHospitals.length ? (
//           <ul className="space-y-4">
//             {registeredHospitals.map((hosp, idx) => (
//               <li key={idx} className="border p-4 rounded bg-slate-50 shadow">
//                 <h3 className="text-lg font-bold">{hosp.name}</h3>
//                 <p>Type: {hosp.role}</p>
//                 <p>Email: {hosp.email}</p>
//                 <p>Address: {hosp.address}</p>
//                 <p>Phone: {hosp.phone}</p>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className="text-gra
//           28y-500">Loading registered facilities...</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default NearbyHospitals;
import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../../services/API";
import { Link } from "react-router-dom";

const GEOAPIFY_API_KEY = "8d0eb3ec69ac476aa662a19f59744fbc";

const NearbyHospitals = () => {
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [nearbyHospitals, setNearbyHospitals] = useState([]);
  const [nearbyBloodBanks, setNearbyBloodBanks] = useState([]);
  const [registeredHospitals, setRegisteredHospitals] = useState([]);

  // Fetch nearby places
  const fetchPlaces = async (lat, lon) => {
    const url = `https://api.geoapify.com/v2/places?categories=healthcare.hospital,healthcare.pharmacy,healthcare.clinic_or_praxis&bias=proximity:${lon},${lat}&limit=20&apiKey=${GEOAPIFY_API_KEY}`;
    try {
      const response = await axios.get(url);
      const allPlaces = response.data.features;

      const hospitals = [];
      const bloodBanks = [];

      allPlaces.forEach((place) => {
        const name = place.properties.name?.toLowerCase() || "";
        if (name.includes("blood")) {
          bloodBanks.push(place);
        } else {
          hospitals.push(place);
        }
      });

      setNearbyHospitals(hospitals);
      setNearbyBloodBanks(bloodBanks);
      console.log("nearby hospitals:", allPlaces);
    } catch (err) {
      console.error("Error fetching facilities:", err);
    }
  };

  // Auto-detect location
  const detectLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lon: longitude });
        fetchPlaces(latitude, longitude);
      },
      (err) => {
        console.error("Geolocation error:", err);
      }
    );
  };

  // Handle autocomplete input change
  const handleInputChange = async (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.length > 2) {
      try {
        const res = await axios.get(
          `https://api.geoapify.com/v1/geocode/autocomplete`,
          {
            params: {
              text: value,
              apiKey: GEOAPIFY_API_KEY,
            },
          }
        );
        setSuggestions(res.data.features);
      } catch (err) {
        console.error("Autocomplete error:", err);
      }
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = async (suggestion) => {
    const lat = suggestion.properties.lat;
    const lon = suggestion.properties.lon;
    setLocation({ lat, lon });
    setInputValue(suggestion.properties.formatted);
    setSuggestions([]);
    fetchPlaces(lat, lon);
    try {
      const res = await fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${GEOAPIFY_API_KEY}`
      );
      const data = await res.json();
      const props = data.features[0]?.properties;

      setUserGeoLocation({
        country: (props.country || "").toLowerCase().trim(),
        state: (props.state || "").toLowerCase().trim(),
        city: (props.city || props.county || props.suburb || props.state || "")
          .toLowerCase()
          .trim(),
      });
    } catch (err) {
      console.error("Reverse geocoding failed:", err);
    }
  };

  // Load system facilities
  useEffect(() => {
    const fetchRegistered = async () => {
      try {
        const { data } = await API.get("/hospital-org/list");
        console.log(data);

        setRegisteredHospitals(data?.hospitals);
        console.log(registeredHospitals);
      } catch (err) {
        console.log("Error fetching registered facilities:", err);
      }
    };
    fetchRegistered();
  }, []);
  const [userGeoLocation, setUserGeoLocation] = useState({
    country: "",
    state: "",
    city: "",
  });

  useEffect(() => {
    const getUserLocationDetails = () => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const res = await fetch(
              `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${GEOAPIFY_API_KEY}`
            );
            const data = await res.json();
            const props = data.features[0]?.properties;
            console.log(data);

            setUserGeoLocation({
              country: props.country.toLowerCase() || "",
              state: props.state.toLowerCase() || "",
              city:
                props.city.toLowerCase() ||
                props.country.toLowerCase() ||
                props.suburb.toLowerCase() ||
                "",
            });
            console.log(userGeoLocation);
          } catch (err) {
            console.error("Error in Geoapify reverse geocoding:", err);
          }
        },
        (err) => {
          console.error("Geolocation permission denied or error:", err);
        }
      );
    };
    getUserLocationDetails();
  }, []);

  return (
    <div className="p-6 sticky">
      <h1 className="text-3xl font-bold text-red-600 mb-6">
        Nearby Hospitals & Blood Banks
      </h1>

      {/* Location Input */}
      <div className="mb-6 ">
        <div className="flex items-center gap-4 mb-2">
          <button
            className="bg-red-600 text-white px-4 py-2 rounded"
            onClick={detectLocation}
          >
            📍 Auto-Detect Location
          </button>

          <div className="relative w-full max-w-md">
            <input
              type="text"
              className="w-full border p-2 rounded"
              placeholder="Enter location..."
              value={inputValue}
              onChange={handleInputChange}
            />
            {suggestions.map((sug, i) => (
              <li
                key={i}
                onClick={() => handleSuggestionClick(sug)}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
              >
                <img
                  src={`https://api.geoapify.com/v1/icon/?type=material&color=%23d32f2f&icon=${
                    sug.properties.result_type || "location"
                  }&apiKey=${GEOAPIFY_API_KEY}`}
                  alt="icon"
                  className="w-5 h-5"
                />
                <span>{sug.properties.formatted}</span>
              </li>
            ))}
          </div>

          <Link
            to="/"
            className="bg-red-600 text-white py-2 px-4 rounded  hover:bg-red-700 transition duration-300 shadow-md"
          >
            Back to Home
          </Link>
        </div>
      </div>

      {/* Real-time Nearby Hospitals */}
      <div className="mb-10">
        <h2 className="text-4xl font-semibold text-slate-800 shadow-red-600  mb-3">
          Nearby Hospitals
        </h2>
        {nearbyHospitals.length ? (
          <ul className="space-y-4">
            {nearbyHospitals.map((place, idx) => (
              <li key={idx} className="border p-4 rounded shadow bg-white">
                <h3 className="text-lg font-bold">
                  {place.properties.name || "Unnamed Facility"}
                </h3>
                <p>Address: {place.properties.formatted}</p>
                <div className="mt-2">
                  <a
                    href={`https://www.google.com/maps?q=${place.geometry.coordinates[1]},${place.geometry.coordinates[0]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <p className="font-semibold text-sm mb-1">
                      🗺️ <span className="text-blue-600">View on Map:</span>
                    </p>
                    {/* <img
          src={`https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=300&height=200&center=lonlat:${place.geometry.coordinates[0]},${place.geometry.coordinates[1]}&zoom=16&marker=lonlat:${place.geometry.coordinates[0]},${place.geometry.coordinates[1]};type:material;color:%23d32f2f;size:medium&apiKey=${GEOAPIFY_API_KEY}`}
          alt="Mini Map"
          className="rounded shadow hover:opacity-80 transition-opacity duration-200"
        /> */}
                  </a>
                  <p>
                    {" "}
                    Distance : {(place.properties.distance / 1000).toFixed(
                      2
                    )}{" "}
                    km away
                  </p>
                </div>
                <p>Type: {place.properties.categories?.join(", ")}</p>
                {place.properties.contact?.phone && (
                  <p className="text-lg">
                    📞 Phone: {place.properties.contact.phone}
                  </p>
                )}
                {place.properties.website && (
                  <p>
                    🌐 Website:{" "}
                    <a
                      href={place.properties.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {place.properties.website}
                    </a>
                  </p>
                )}
                {/* <p>⭐ Rating: <span className="text-yellow-500">Not available</span></p> */}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No hospitals found yet.</p>
        )}
      </div>

      {/* Real-time Nearby Blood Banks */}
      <div className="mb-10">
        <h2 className="text-4xl font-semibold text-slate-800 shadow-red-600  mb-3">
          Nearby Blood Banks
        </h2>
        {nearbyBloodBanks.length ? (
          <ul className="space-y-4">
            {nearbyBloodBanks.map((place, idx) => (
              <li key={idx} className="border p-4 rounded shadow bg-white">
                <h3 className="text-lg font-bold">
                  {place.properties.name || "Unnamed Facility"}
                </h3>
                <p>Address: {place.properties.formatted}</p>
                <p>Type: {place.properties.categories?.join(", ")}</p>
                {place.properties.contact?.phone && (
                  <p>📞 Phone: {place.properties.contact.phone}</p>
                )}
                {place.properties.website && (
                  <p>
                    🌐 Website:{" "}
                    <a
                      href={place.properties.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {place.properties.website}
                    </a>
                  </p>
                )}
                <p>
                  ⭐ Rating:{" "}
                  <span className="text-yellow-500">Not available</span>
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No blood banks detected nearby.</p>
        )}
      </div>

      {/* <div>
        <h2  className="text-4xl font-semibold text-slate-800 shadow-red-600  mb-3">Registered Facilities in Our System</h2>
        {registeredHospitals.length ? (
  <ul className="space-y-4">
    {registeredHospitals
      .filter((hosp) => {
  return (
    hosp.location.country?.toLowerCase() === userGeoLocation.country.toLowerCase() &&
    hosp.location.state?.toLowerCase() === userGeoLocation.state.toLowerCase() &&
    hosp.location.city?.toLowerCase() === userGeoLocation.city.toLowerCase()
  );
})
      .map((hosp, idx) => (

              <li key={idx} className="border p-4 rounded bg-slate-50 shadow">
                <h3 className="text-lg font-bold">{hosp.organisationName ? hosp.organisationName : hosp.hospitalName}</h3>
                <p>Type: {hosp.role=="Organisation"?hosp.role+" / Blood Bank":hosp.role}</p>
                <p>Email: {hosp.email}</p>
                <p>Address: {hosp.location.full}</p>
                <p>📞 Phone: {hosp.phoneNumber}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Loading registered facilities...</p>
        )}
      </div> */}
      {/* //-----------------it will show all regise=tered bloodbank and hospitals without current location filteration */}
      {/* Registered Facilities */}
      <div>
        <h2 className="text-4xl font-semibold text-slate-800 shadow-red-600  mb-3">
          Registered Facilities in Our System
        </h2>
        {registeredHospitals.length ? (
          <ul className="space-y-4">
            {registeredHospitals.map((hosp, idx) => (
              <li key={idx} className="border p-4 rounded bg-slate-50 shadow">
                <h3 className="text-lg font-bold">
                  {hosp.organisationName
                    ? hosp.organisationName
                    : hosp.hospitalName}
                </h3>
                <p>
                  Type:{" "}
                  {hosp.role == "Organisation"
                    ? hosp.role + " / Blood Bank"
                    : hosp.role}
                </p>
                <p>Email: {hosp.email}</p>
                <p>Address: {hosp.location.full}</p>
                <p>Phone: {hosp.phoneNumber}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Loading registered facilities...</p>
        )}
      </div>
    </div>
  );
};

export default NearbyHospitals;
