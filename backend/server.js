const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

dotenv.config();
connectDB();

const app = express();

// This allows frontend requests from React.
app.use(cors());

// This allows backend to read JSON data from request body.
app.use(express.json());

app.get("/", (req, res) => {
  res.send("WoodWise backend is running");
});

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
