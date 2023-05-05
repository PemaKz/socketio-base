const lang = require("../lang");

module.exports = async (io, socket, params) => {
  if(!socket.user) throw new Error( lang(socket, 'NotLogin') );
  const { authToken } = params;
  if (!authToken) throw new Error( lang(socket, 'MissingAuthToken') );
  await socket.user.removeAuthToken(authToken);
  return lang(socket, 'AuthTokenRemoved')
};