const { User, Role, UserNotification, MarketplaceTrade, Marketplace } = require('../models');
const cache = require('../services/Cache');

module.exports = async (socket, next) => {
  try {
    const token = socket.handshake.query.authToken;
    if (token) {
      const cacheToken = await cache.keys(`userTokens:${token}:*`);
      if (cacheToken.length > 0) {
        const userID = cacheToken[0].split(':')[2];
        const user = await User.findOne({ 
          where: { id: userID },
          include: [
            {
              model: Role,
            },
            {
              model: UserNotification,
            },
            {
              model: MarketplaceTrade,
              include: [
                {
                  model: Marketplace,
                },
                {
                  model: User,
                }
              ]
            },
            {
              model: Marketplace,
              include: [
                {
                  model: MarketplaceTrade,
                },
                {
                  model: User,
                }
              ]
            }
          ],
          attributes: {
            exclude: ['password'], 
          },
        });
        if (user){
          socket.user = user;
          socket.token = token;
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