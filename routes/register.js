const lang = require("../lang");
const { User } = require("../models");

module.exports = async (io, socket, params) => {
  if(socket.user) throw new Error( lang(socket, 'AlreadyLogin') );
  const { username, password } = params;
  if (!username || !password) throw new Error( lang(socket, 'MissingUserOrPassword') );
  const user = await User.findOne({ where: { username } });
  if (user) throw new Error( lang(socket, 'AlreadyRegistered') );
  const newUser = await User.create({ username, password });
  const token = await newUser.generateAuthToken();
  socket.user = newUser;
  io.to(socket.id).emit('register', { success: true, token, user: newUser });
};