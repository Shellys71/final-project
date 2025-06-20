const express = require("express");
require('dotenv').config();
const cors = require("cors");
const app = express();
require("./db/mongoose");
const userRouter = require("./routers/user");
const requestRouter = require("./routers/request");
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(userRouter);
app.use(requestRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
