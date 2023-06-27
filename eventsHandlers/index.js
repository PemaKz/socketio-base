const { UserNotification, Deposit, User } = require("../models")
const cache = require('../services/Cache')
let isTaskRunning = false;

module.exports = async (io) => {
  UserNotification.addHook('afterCreate', async (notification, options) => {
    const allSockets = await io.fetchSockets();
    const userSocket = Array.from(allSockets).find(socket => socket.user && socket.user.id === notification.user_id);
    if(userSocket) await userSocket.emit('notification', JSON.stringify(notification.dataValues));
  })
  UserNotification.addHook('beforeUpdate', async (notification, options) => {
    const allSockets = await io.fetchSockets();
    const userSocket = Array.from(allSockets).find(socket => socket.user && socket.user.id === notification.user_id);
    if(userSocket) await userSocket.emit('notification', JSON.stringify(notification.dataValues));
  })
  
  setInterval(async () => {
    if(isTaskRunning) return;
    isTaskRunning = true;
    try{
      const depositsConfirmed = await cache.keys('depositConfirmed:*');
      if(depositsConfirmed.length > 0){
        const deposits = await cache.mGet(depositsConfirmed);
        const allSockets = await io.fetchSockets();
        let i = 0;
        for(const depositTXID of deposits){
          const userID = depositsConfirmed[i].split(':')[1];
          i++;
          const userSocket = Array.from(allSockets).find(socket => socket.user && socket.user.id === userID);
          await cache.del(`depositConfirmed:${depositTXID}`);
          if(!userSocket) continue;
          const deposit = await Deposit.findOne({
            where: {
              txid: depositTXID,
            }
          });
          await userSocket.emit('deposit', JSON.stringify(deposit.dataValues));
          const userBalance = await User.findOne({ where: { id: userID } });
          await userSocket.emit('balanceUpdate', JSON.stringify({ balance: userBalance.balance }));
          await UserNotification.create({
            user_id: userID,
            title: 'Depósito confirmado',
            message: `O depósito no valor de R$${deposit.amount} foi confirmado.`,
            type: 'deposit',
          })
        }
      } else {

      }
    } catch(e){
      console.log(e);
    }
    isTaskRunning = false;
  }, 1000 * 10)
 
}