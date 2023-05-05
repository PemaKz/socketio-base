
module.exports = async (socket, next) => {
  const lang = socket.handshake.query.lang || 'en';
  socket.lang = lang;
  next();
};