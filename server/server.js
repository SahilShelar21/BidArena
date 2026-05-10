require('dotenv').config();
const http = require("http");
const { Server } = require("socket.io");
const app = require('./app');

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://frontend-299v.onrender.com",
    methods: ["GET","POST"]
  }
});

require('./socket/auctionSocket')(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, ()=>console.log(`Server Running on port ${PORT}`));