const lang = require("../lang");
const { User, Role } = require("../models");

module.exports = async (io, socket, params) => {
  if(!socket.user) throw new Error( lang(socket, 'NotLogin') );
  return socket.user
};