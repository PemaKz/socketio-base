
const lang = require("../../lang");
const { Deposit } = require('../../models');

module.exports = async (io, socket, params) => {
  try{
    if(!socket.user) throw new Error( lang(socket, 'NotLogin') );
    const deposits = await Deposit.findAll({
      where: {
        user_id: socket.user.id,
      },
      order: [
        ['id', 'DESC'],
      ],
      limit: 5,
    });
    return deposits;
  } catch(e){
    console.log(e);
    throw e;
  }
}