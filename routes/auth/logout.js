const lang = require("../../lang");
const cache = require('../../services/Cache');

module.exports = async (io, socket, params) => {
  try{
    if(!socket.user) throw new Error( lang(socket, 'NotLogin') );
    await socket.user.removeAuthToken(socket.token);
    socket.user = null;
    return lang(socket, 'LogoutSuccess');
  } catch (error) {
    console.log(error);
  }
};