const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
// const productRoutes = require('./routes/product')

const app = express();
dotenv.config();
const port = process.env.PORT || 8000;
connectDB();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/v1/product", require("./routes/product")); //
app.use("/api/v1/user", require("./routes/auth"));
app.use("/api/v1/cat", require("./routes/category"));
app.use("/api/v1/reserve", require("./routes/reserve"));
app.use("/api/v1/order", require("./routes/order"));
app.use("/api/v1/market", require("./routes/market"));
app.use("/api/v1/status", require("./routes/status"));
app.use("/api/v1/chinese/seller", require("./routes/chineseSeller"));

///Uploading file
app.use("/images", express.static(path.join(__dirname, "/upload/image"))); //getting image from data
app.get("/",(req,res)=>{
  res.send("api is running");
  console.log("api is running")
})

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
