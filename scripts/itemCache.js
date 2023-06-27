const cache = require('../services/Cache');

module.exports = async (assetsID) => {
  return new Promise(async (resolve, reject) => {
    try{
      let items;
      if(Array.isArray(assetsID)) {
        if(assetsID.length === 0) return resolve([]);
        items = await cache.mGet(assetsID.map(id => `itemInfo:${id}`));
        return resolve(items.map(item => JSON.parse(item)));
      } else {
        items = await cache.get(`itemInfo:${assetsID}`);
        return resolve(JSON.parse(items));
      }
    } catch(e){
      console.log(e);
      reject(e);
    }
  })
}