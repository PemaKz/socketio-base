const lang = require("../lang");

module.exports = async (io, socket, params) => {
  if(!socket.user) throw new Error( lang(socket, 'NotLogin') );
  io.emit('user', JSON.stringify({
    user: socket.user,
    token: socket.token
  }));
  return lang(socket, 'UserLoaded')
};