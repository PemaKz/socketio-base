const lang = require("../../lang");
const { Withdraw } = require('../../models');

module.exports = async (io, socket, params) => {
  try{
    if(!socket.user) throw new Error( lang(socket, 'NotLogin') );
    const withdrawals = await Withdraw.findAll({
      where: {
        user_id: socket.user.id,
      },
      order: [
        ['id', 'DESC'],
      ],
      limit: 5,
    });
    return withdrawals;
  } catch(e){
    console.log(e);
    throw e;
  }
}