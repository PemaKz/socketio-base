const { User } = require('../models');
const cache = require('../services/Cache');

module.exports = async (socket, next) => {
  try {
    const token = socket.handshake.query.authToken;
    if (token) {
      const cacheToken = await cache.keys(`userTokens:${token}:*`);
      console.log(cacheToken);
      if (cacheToken.length > 0) {
        const userID = cacheToken[0].split(':')[2];
        const user = await User.findOne({ where: { id: userID } });
        if (user){
          socket.user = user;
          return next();
        }
      }
    } 
    socket.user = null;
    next();
  } catch (error) {
    console.log(`${socket.id} : ${error}`);
  }
};