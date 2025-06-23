const express = require("express");
require('dotenv').config();
const cors = require("cors");
require("./db/mongoose");
const socketio = require("socket.io");
const userRouter = require("./routers/user");
const requestRouter = require("./routers/request");
const port = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.json());
app.use(userRouter);
app.use(requestRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
