const lang = require("../../lang");

module.exports = async (io, socket, params) => {
  if(!socket.user) throw new Error( lang(socket, 'NotLogin') );
  const { oldPassword, newPassword } = params;
  if(!socket.user.validPassword(oldPassword)) throw new Error( lang(socket, 'InvalidOldPassword') );
  if(!oldPassword) throw new Error( lang(socket, 'MissingOldPassword') );
  if(!newPassword) throw new Error( lang(socket, 'MissingNewPassword') );
  await socket.user.updatePassword(newPassword);
  return lang(socket, 'PasswordUpdated')
};