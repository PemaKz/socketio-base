const lang = require("../../lang");
const getItemInfo = require("../../scripts/getItemInfo");
const cache = require('../../services/Cache');
const ItemsCache = require('../../services/ItemsCache');
const { Marketplace } = require('../../models');

module.exports = async (io, socket, params) => {
  try{
    if(!socket.user) throw new Error( lang(socket, 'NotLogin') );
    const { item_id, price } = params;
    if(socket.user.marketplace_ban_expires_at > new Date()) throw new Error('You are banned from marketplace until ' + new Date(socket.user.marketplace_ban_expires_at).toLocaleString());
    if(!item_id) throw new Error('Item ID is required');
    if(!price) throw new Error('Price is required');
    if(Number(price) < 0.01) throw new Error('Price must be greater than 0.01');
    if(socket.user.steam_trade_url === null) throw new Error('You need to set your steam trade url first');
    if(socket.user.steam_api_key === null) throw new Error('You need to set your steam api key first');
    const item = await Marketplace.findOne({where: {item_id, finished: false}});
    if(item) throw new Error('Item already in marketplace');
    let inventory = await cache.get(`csgoinventory:${socket.user.steam_id}`);
    if(!inventory) throw new Error('Inventory not found');
    inventory = JSON.parse(inventory);
    const itemInfo = inventory.find(item => item.assetid === item_id);
    if(!itemInfo) throw new Error('Item not found in inventory');
    const itemGeneralInfo = await ItemsCache.getItem(itemInfo.item_hash);
    await Marketplace.create({
      item_id,
      item_hash: itemInfo.item_hash,
      price: Number(price),
      user_id: socket.user.id,
      float: itemInfo.float ? itemInfo.float : 0,
      gun_type: itemGeneralInfo.gun_type ? itemGeneralInfo.gun_type : '',
      status: itemGeneralInfo.exterior ? itemGeneralInfo.exterior : '',
      type: itemGeneralInfo.type ? itemGeneralInfo.type : (itemGeneralInfo.sticker ? 'Sticker' : ''),
    });
    socket.emit("inventoryUpdate", JSON.stringify({
      message: lang(socket.lang, "inventoryUpdate"),
      item: await getItemInfo(socket.user.steam_id, item_id),
    }));
    return lang(socket.lang, "itemAddedToMarketplace");
  } catch(e){
    console.log(e);
    throw e;
  }
}