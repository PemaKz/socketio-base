const lang = require("../../lang");
const getItemInfo = require("../../scripts/getItemInfo");
const cache = require('../../services/Cache');
const { Marketplace, MarketplaceTrade, Deposit } = require('../../models');
const Gerencia = require('../../services/Gerencia');

module.exports = async (io, socket, params) => {
  try{
    if(!socket.user) throw new Error( lang(socket, 'NotLogin') );
    const { fullName, CPF, amount } = params;
    if(!fullName) throw new Error( lang(socket, 'InvalidFullName') );
    if(!CPF) throw new Error( lang(socket, 'InvalidCPF') );
    if(!amount) throw new Error( lang(socket, 'InvalidAmount') );
    if(amount < 10) throw new Error( lang(socket, 'InvalidAmount') );
    const pixCharge = await Gerencia.createPixCharge({ fullName, CPF, price: amount });
    const pixQRCode = await Gerencia.generateQRCode({ locID: pixCharge.loc.id });
    const depositInfo = await Deposit.create({
      txid: pixCharge.txid,
      cpf: CPF,
      name: fullName,
      amount: amount,
      chave: pixCharge.chave,
      status: 0,
      expiry_at: new Date(new Date(pixCharge.calendario.criacao).getTime() + (pixCharge.calendario.expiracao * 1000)),
      user_id: socket.user.id,
    });
    return {
      ...depositInfo.dataValues,
      pixQRCode,
    };
  } catch(e){
    console.log(e);
    throw e;
  }
}