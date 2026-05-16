const app = require("./app");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

app.use("/uploads", require("express").static("uploads"));

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});