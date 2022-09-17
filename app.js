const cors = require("cors");
const express = require("express");
const db = require("./db/connection.js");
const cookieParser = require("cookie-parser");

const app = express();
const auth = require("./router/auth");
const notes = require("./router/notes");

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/',(req,res,next) => {
  res.send('api connected')
} )
app.use("/api", auth);
app.use("/notes", notes);

db.on("error", console.error.bind(console, "Mongodb connection failed"));

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

app.listen(2000, () => {
  console.log("server running on 2000");
});
