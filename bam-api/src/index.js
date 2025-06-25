const express = require("express");
require("dotenv").config();
const cors = require("cors");
require("./db/mongoose");
const { createServer } = require("http");
const { Server } = require("socket.io");
const userRouter = require("./routers/user");
const requestRouter = require("./routers/request");
const port = process.env.PORT;

const app = express();

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: process.env.REACT_CLIENT_HOST,
    methods: ["GET", "PATCH", "POST"],
  },
});

io.listen(process.env.EVENT_HANDLER_PORT, () => {
  console.log(
    `[INFO] Websocket server is running on port ${process.env.EVENT_HANDLER_PORT}`
  );
});

io.on("connection", (socket) => {
  console.log(`[INFO] WebSocket connection, ${socket.id}`);

  socket.on("approvedRequest", () => {
    socket.emit("updateRequests");
  });

  socket.on("rejectedRequest", () => {
    socket.emit("updateRequests");
  });

  socket.on("disconnect", () => {
    console.log(`[INFO] WebSocket disconnection, ${socket.id}`);
  });
});

app.use(cors());
app.use(express.json());
app.use(userRouter);
app.use(requestRouter);

app.listen(port, () => {
  console.log(`[INFO] Webserver is running on port ${port}`);
});
