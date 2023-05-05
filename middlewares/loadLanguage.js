
module.exports = async (socket, next) => {
  try{
    const lang = socket.handshake.query.lang || 'en';
    socket.lang = lang;
  } catch (error) {
    console.log(`${socket.id} : ${error}`);
  }
  next();
};