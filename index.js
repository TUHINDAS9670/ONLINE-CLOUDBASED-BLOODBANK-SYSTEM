const express = require("express");
const dotenv=require('dotenv')
const colors=require('colors')//form implementing diff color in console
const morgan=require('morgan')//with the help of morgan we can show that request come on which url and display it in console
const cors=require('cors')//for linking node server with react frontend
const connectDB=require("./config/db")
const path=require('path')
const fs = require("fs");


//dot config
dotenv.config();

//mongodb connection
connectDB();
//rest object
const app = express();

//middlewares
app.use(express.json())
app.use(cors())
app.use(morgan())

//routes
app.use("/api/v1/test", require("./routes/testRoutes"));
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use('/api/v1/inventory',require('./routes/inventoryRoutes'))
app.use('/api/v1/analytics',require('./routes/analyticsRoutes'))
app.use('/api/v1/admin',require('./routes/adminRoutes'))
app.use('/api/v1/donations', require('./routes/donationRoutes'));
app.use("/api/v1/hospital-org", require("./routes/NoUserRoutes"));
app.use("/api/v1/user", require("./routes/userRoutes"));
app.use('/api/v1/hospital-requests', require('./routes/HospitalBloodRequestController'));


// app.use("/api/v1/notifications", require("./routes/notificationRoute"));
app.use("/api/v1/emergency", require("./routes/emergencyRequestRoutes"));
app.use("/api/v1/emergency-donor", require("./routes/emergencyDonorRoutes"));


//static folder
//PORT
const PORT =  process.env.PORT || 3000;

const uploadsDir = path.join(__dirname, "uploads", "documents");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Created folder:", uploadsDir);
}
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname,'./client/dist')))
app.get("/view-document/:filename", (req, res) => {
  const filePath = path.join(__dirname, "uploads", "documents", req.params.filename);
  const ext = path.extname(filePath).toLowerCase();

  const mimeTypes = {
    ".pdf": "application/pdf",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png"
  };

  const contentType = mimeTypes[ext] || "application/octet-stream";

  res.setHeader("Content-Type", contentType);
  res.sendFile(filePath);
});

// STATIC ROUTeS
app.get('*',function(req,res){
  res.sendFile(path.join(__dirname,"./client/dist/index.html" ))
})

app.listen(PORT, () => {
  console.log(`server running in ${process.env.DEV_MODE} mode on port ${PORT} successfuly`.bgWhite.green);
}); 

