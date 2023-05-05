const lang = require("../lang");

module.exports = async (io, socket, params) => {
  if(!socket.user) throw new Error( lang(socket, 'NotLogin') );
  const { email} = params;
  if (!email) throw new Error( lang(socket, 'MissingEmail') );
  if (email.length > 255) throw new Error( lang(socket, 'EmailTooLong') );
  socket.user.email = email;
  await socket.user.save();
  return lang(socket, 'ProfileUpdated')
};