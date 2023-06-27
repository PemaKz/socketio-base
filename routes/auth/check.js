const lang = require("../../lang");

module.exports = async (io, socket, params) => {
  if(!socket.user) throw new Error( lang(socket, 'NotLogin') );
  socket.emit('user', JSON.stringify({
    user: socket.user,
    token: socket.token
  }));
  socket.emit('authCheck', JSON.stringify({
    success: true,
    message: lang(socket, 'UserLoaded'),
  }));
  return null
};