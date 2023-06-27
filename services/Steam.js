const SteamAuth = require("node-steam-openid");

const steamAuth = new SteamAuth({
  realm: process.env.REALM_URL, // Site name displayed to users on logon
  returnUrl: `${process.env.REALM_URL}`, // Your return route
  apiKey: process.env.STEAM_API_KEY // Steam API key
});

module.exports = steamAuth
