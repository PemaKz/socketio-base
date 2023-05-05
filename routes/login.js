const lang = require("../lang");
const { User, Role } = require("../models");

module.exports = async (io, socket, params) => {
  if(socket.user) throw new Error( lang(socket, 'AlreadyLogin') );
  const { username, password } = params;
  if (!username || !password) throw new Error( lang(socket, 'MissingUserOrPassword') );
  const user = await User.findOne({ 
    where: { username },
    include: [
      {
        model: Role,
      }
    ]
  });
  if (!user) throw new Error( lang(socket, 'InvalidUserOrPassword') );
  if(!user.validPassword(password)) throw new Error( lang(socket, 'InvalidUserOrPassword') );
  if (user.banned) throw new Error( lang(socket, 'UserBanned') );
  const token = await user.generateAuthToken();
  user.password = undefined;
  socket.user = user;
  return {token, user}
};