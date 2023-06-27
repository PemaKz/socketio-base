const lang = require("../../lang");
const { Withdraw } = require('../../models');
const Gerencia = require('../../services/Gerencia');

module.exports = async (io, socket, params) => {
  try{
    if(!socket.user) throw new Error( lang(socket, 'NotLogin') );
    const { fullName, pixChave, amount, CPF } = params;
    if(!fullName) throw new Error( lang(socket, 'InvalidFullName') );
    if(!CPF) throw new Error( lang(socket, 'InvalidCPF') );
    if(!amount) throw new Error( lang(socket, 'InvalidAmount') );
    if(amount < 10) throw new Error( lang(socket, 'InvalidAmount') );
    if(socket.user.balance < amount) throw new Error( lang(socket, 'InsufficientBalance') );
    const pixWithdrawal = await Gerencia.createWithdrawal({ pixChave, amount });
    await Withdraw.create({
      txid: pixWithdrawal.txid,
      status: 0,
      user_id: socket.user.id,
      amount,
      chave: pixChave,
      name: fullName,
      cpf: CPF,
    });
    socket.user.balance -= amount;
    await socket.user.save();
    await UserNotification.create({
      user_id: socket.user.id,
      title: 'Saque solicitado',
      message: `O saque no valor de R$${amount} foi solicitado.`,
      type: 'withdrawal',
    })
    socket.emit('balanceUpdate', JSON.stringify({ balance: socket.user.balance }));
    return pixWithdrawal;
  } catch(e){
    console.log(e);
    throw e;
  }
}