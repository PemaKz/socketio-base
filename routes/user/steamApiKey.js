const lang = require("../../lang");

module.exports = async (io, socket, params) => {
  let { steam_api_key } = params;
  if(!steam_api_key) throw new Error("Steam API Key is required");
  if(!socket.user) throw new Error("User not found");
  socket.user.steam_api_key = steam_api_key;
  await socket.user.save();
  socket.emit('user', JSON.stringify({
    user: socket.user,
    token: socket.token
  }));
  return lang(lang, "SteamApiKeyUpdated");
};