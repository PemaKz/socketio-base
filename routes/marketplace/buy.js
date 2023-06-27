const lang = require("../../lang");
const { MarketplaceTrade, Marketplace, UserNotification } = require("../../models");

module.exports = async (io, socket, params) => {
  try{
    const {item_id} = params;
    if(!item_id) throw new Error('Item ID is socketuired');
    if(socket.user.steam_trade_url === null) throw new Error('You need to set your steam trade url first');
    if(socket.user.steam_api_key === null) throw new Error('You need to set your steam api key first');
    const item = await Marketplace.findOne({where: {item_id: item_id, finished: false}});
    if(!item) throw new Error('Item not found');
    if(item.finished) throw new Error('Item sale is finished already');
    if(item.user_id === socket.user.id) throw new Error('You can\'t buy your own item');
    if(socket.user.balance < item.price) throw new Error('Not enough balance');
    if(item.on_trade) throw new Error('Item already on trade');
    item.on_trade = true;
    await MarketplaceTrade.create({
      marketplace_id: item.id,
      buyer_id: socket.user.id,
      status: 1,
      expiry_at: new Date(Date.now() + 1000 * 60 * 60 * 12),
    });
    socket.user.balance -= item.price;
    await socket.user.save();
    await item.save();
    await UserNotification.create({
      user_id: item.user_id,
      title: 'Selling process started',
      message: `Your item ${item.item_hash} it's on trade for ${item.price} coins. Please send the item`,
      type: 'marketplace',
    });
    await UserNotification.create({
      user_id: socket.user.id,
      title: 'Buying process started',
      message: `You bought ${item.item_hash} for ${item.price} coins. Please wait for the seller to send the item`,
      type: 'marketplace',
    });
    socket.emit("balanceUpdate", JSON.stringify({
      balance: socket.user.balance,
      message: lang(socket.lang, "balanceUpdate"),
    }));
    return lang(socket.lang, "itemAddedToMarketplace");
  } catch(e){
    console.log(e);
    throw e;
  }
}