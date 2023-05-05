const lang = require("../lang");

module.exports = async (io, socket, params) => {
  if(!socket.user) throw new Error( lang(socket, 'NotLogin') );
  socket.user = null;
  return lang(socket, 'LogoutSuccess');
};