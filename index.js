const express = require("express");
const dotenv=require('dotenv')
const colors=require('colors')//form implementing diff color in console
const morgan=require('morgan')//with the help of morgan we can show that request come on which url and display it in console
const cors=require('cors')//for linking node server with react frontend
const connectDB=require("./config/db")
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
//PORT
const PORT =  process.env.PORT || 3000;


app.listen(PORT, () => {
  console.log(`server running in ${process.env.DEV_MODE} mode on port ${process.env.PORT} successfuly`.bgWhite.green);
}); 
