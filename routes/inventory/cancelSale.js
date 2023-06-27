const lang = require("../../lang");
const getItemInfo = require("../../scripts/getItemInfo");
const cache = require('../../services/Cache');
const { Marketplace, MarketplaceTrade } = require('../../models');

module.exports = async (io, socket, params) => {
  try{
    const {item_id} = params;
    if(!item_id) throw new Error('Item ID is required');
    const item = await Marketplace.findOne({where: {item_id, finished: false}});
    if(!item) throw new Error('Item not found');
    if(item.on_trade) throw new Error('Item is on trade');
    await item.update({finished: 1});
    await MarketplaceTrade.update({status: 12}, {
      where: {
        marketplace_id: item.id,
        ended_at: null
      }
    });
    socket.emit("inventoryUpdate", JSON.stringify({
      message: lang(socket.lang, "saleCanceled"),
      item: await getItemInfo(socket.user.steam_id, item_id),
    }));
    return lang(socket.lang, "saleCanceled");
  } catch(e){
    console.log(e);
    throw e;
  }
}