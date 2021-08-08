require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const userRouter = require("./src/routers/userRouter");
const ticketRouter = require("./src/routers/ticketRouter");
const tokenRouter = require("./src/routers/tokenRouter");
const handleError = require("./src/utils/errorHandler");

const app = express();
const port = process.env.PORT || 3001;

// Basic Helmet security, CORS & Logger Setup
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan("tiny"));

// MongoDB Connection Setup
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

// This code runs only on development
if (process.env.NODE_ENV !== "production") {
  const mongoDB = mongoose.connection;

  mongoDB.on("open", () => {
    console.log("MongoDB is Connected");
  });

  mongoDB.on("error", (error) => {
    console.log(error);
  });
}

// Load Custom Routers
app.use("/v1/user", userRouter);
app.use("/v1/ticket", ticketRouter);
app.use("/v1/tokens", tokenRouter);

// Error Handler & 404
app.use((req, res, next) => {
  const error = new Error("It's a 404!");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  handleError(error, res);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
