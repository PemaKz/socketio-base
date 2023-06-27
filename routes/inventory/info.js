const cache = require('../../services/Cache');
const ItemsCache = require('../../services/ItemsCache');
const { Marketplace } = require('../../models');

module.exports = async (io, socket, params) => {
  try{
    if(!socket.user) throw new Error( lang(socket, 'NotLogin') );
    let inventory = await cache.get(`csgoinventory:${socket.user.steam_id}`)
    inventory = JSON.parse(inventory);
    if(!inventory) return null;
    const allItems = await ItemsCache.getItems();
    let inventoryParsed = inventory.map(item => {
      const itemData = allItems.find(i => i.name === item.item_hash);
      if(!itemData) return null
      return {
        ...item,
        ...itemData,
      }
    }).filter(item => item !== null);
    const itemsInMarketplace = await Marketplace.findAll({
      where: {
        item_id: inventoryParsed.map(item => item.assetid),
        finished: false,
      }
    });
    inventoryParsed = inventoryParsed.map(item => {
      const itemInMarketplace = itemsInMarketplace.find(i => i.item_id === item.assetid);
      if(itemInMarketplace){
        return {
          ...item,
          on_marketplace: true,
          marketplace_item_id: itemInMarketplace.id,
          marketplace_price: itemInMarketplace.price,
        }
      }
      return {
        ...item,
        on_marketplace: false,
      }
    });
    
    return inventoryParsed;
  } catch(e){
    console.log(e);
    throw e
  }
}