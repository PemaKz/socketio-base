const lang = require("../lang");

module.exports = async (io, socket, params) => {
  try{
    if(!socket.user) throw new Error( lang(socket, 'NotLogin') );
    const { authToken } = params;
    if (!authToken) throw new Error( lang(socket, 'MissingAuthToken') );
    await socket.user.removeAuthToken(authToken);
    io.to(socket.id).emit('myAuthTokens', { success: true, message: lang(socket, 'AuthTokenRemoved') });
  } catch (err) {
    io.to(socket.id).emit('myAuthTokens', { success: false, message: err.message });
  }
};