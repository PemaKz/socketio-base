const lang = require("../lang");
const { User } = require("../models");

module.exports = async (io, socket, params) => {
  try{
    if(socket.user) throw new Error( lang(socket, 'AlreadyLogin') );
    const { username, password } = params;
    if (!username || !password) throw new Error( lang(socket, 'MissingUserOrPassword') );
    const user = await User.findOne({ where: { username } });
    if (!user) throw new Error( lang(socket, 'InvalidUserOrPassword') );
    if(!user.validPassword(password)) throw new Error( lang(socket, 'InvalidUserOrPassword') );
    if (user.banned) throw new Error( lang(socket, 'UserBanned') );
    const token = await user.generateAuthToken();
    io.to(socket.id).emit('login', { token });
    socket.user = user;
  } catch (err) {
    io.to(socket.id).emit('login', { success: false, message: err.message });
  }
};