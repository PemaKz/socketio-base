const lang = require("../lang");
const { User } = require("../models");

module.exports = async (io, socket, params) => {
  if(socket.user) throw new Error( lang(socket, 'AlreadyLogin') );
  const { username, password } = params;
  if (!username || !password) throw new Error( lang(socket, 'MissingUserOrPassword') );
  const user = await User.findOne({ where: { username } });
  if (user) throw new Error( lang(socket, 'AlreadyRegistered') );
  let newUser = await User.create({ username, password });
  const token = await newUser.generateAuthToken();
  delete newUser.dataValues.password;
  socket.user = newUser;
  socket.token = token;
  socket.emit('user', JSON.stringify({
    user: newUser,
    token: token
  }));
  return null
};