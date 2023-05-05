const lang = require("../lang");

module.exports = async (io, socket, params) => {
  if(!socket.user) throw new Error( lang(socket, 'NotLogin') );
  const tokens = await socket.user.getAuthTokens();
  io.to(socket.id).emit('myAuthTokens', { success: true, tokens });
};