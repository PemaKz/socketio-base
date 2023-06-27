const lang = require("../../lang");

module.exports = async (io, socket, params) => {
  let { steam_trade_url } = params;
  if(!steam_trade_url) throw new Error("Steam Trade URL is required");
  if(!socket.user) throw new Error("User not found");
  socket.user.steam_trade_url = steam_trade_url;
  await socket.user.save();
  socket.emit('user', JSON.stringify({
    user: socket.user,
    token: socket.token
  }));
  return lang(lang, "SteamApiKeyUpdated");
};