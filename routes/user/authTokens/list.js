const lang = require("../../../lang");

module.exports = async (io, socket, params) => {
  if(!socket.user) throw new Error( lang(socket, 'NotLogin') );
  const tokens = await socket.user.getAuthTokens();
  return tokens;
};