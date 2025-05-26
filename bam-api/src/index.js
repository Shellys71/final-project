// server/server.js
const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.get("/api/data", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

app.post("/api/data", (req, res) => {
  const { data } = req.body;
  res.json({ received: `Data sent: ${data}` });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// const express = require("express");
// const app = express();
// const port = 3000;

// app.use(express.json());

// app.get("/api/data", (req, res) => {
//   res.json({ message: "Hello from the backend!" });
// });

// app.post("/api/data", (req, res) => {
//   const { data } = req.body;
//   res.json({ received: `Data sent: ${data}` });
// });

// // app.get('/', (req, res) => {
// //   res.send('Hello World!')
// // });

// // app.get('/sushi', (req, res) => {
// //   res.send('Hello Sushi!')
// // });

// app.listen(port, () => {
//   console.log("Server is up on port " + port);
// });
