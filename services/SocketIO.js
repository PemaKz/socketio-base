const { Server } = require("socket.io");
const routes = require("../routes");
const middlewares = require("../middlewares");
const SocketPort = process.env.PORT || 8080;

/* Socket Server Setup */
const socketOptions = {
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
    //skipMiddlewares: true,
  }
};
const io = new Server(SocketPort, socketOptions);

/* Socket Middlewares */
Object.keys(middlewares).forEach((middleware) => {
  io.use(middlewares[middleware]);
});

/* Socket Client Connect */
io.on("connection", (socket) => {
  console.log("Socket connected: " + socket.id);
  
  /* Socket Client Message */
  socket.on("message", (msg) => routes(io, socket, msg));

  /* Socket Client Disconnect */
  socket.on("disconnect", () => {
    console.log("Socket disconnected: " + socket.id);
  });

  /* Socket Error */
  socket.on("error", (err) => {
    console.log("Socket error: " + err);
  });
});



console.log("Socket.IO server listening on ws://localhost:" + SocketPort);

module.exports = io;