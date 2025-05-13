const addressSchema = new mongoose.Schema({
  country: String,
  state: String,
  district: String,
  city: String,
  full: String,
  coordinates: {
    lat: Number,
    lng: Number,
  },
});

const emergencyRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    quantity: { type: Number, required: true },
    location: { type: addressSchema, required: true }, // supports both manual and geolocation
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
    organisationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // assuming organisations are in users
      default: null,
    },
  },
  { timestamps: true }
);
