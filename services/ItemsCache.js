const cache = require('./Cache');
let allItems = [];

const reloadItems = async () => {
  return new Promise(async (resolve, reject) => {
    try{
      console.log('Reloading items cache...');
      const keys = await cache.keys('item:*');
      const items = await cache.mGet(keys).then(items => items.map(item => JSON.parse(item)));
      console.log(`Loaded ${items.length} items.`);
      allItems = items;
      resolve();
    } catch(e){
      console.log(`Error while tracking all items prices: ${e.message}`);
    }
    
  });
}

reloadItems();

module.exports = {
  getItems: async () => {
    if(allItems.length === 0) await reloadItems();
    return allItems;
  },
  getItem: async (hash) => {
    if(allItems.length === 0) await reloadItems();
    return allItems.find(item => item.market_hash_name === hash);
  },
  getInventory: async (steamid) => {
    const items = await cache.get(`csgoinventory:${steamid}`);
    if(!items) return [];
    return JSON.parse(items);
  },
  reloadItems: reloadItems,
};