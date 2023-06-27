const { Op } = require("sequelize");
const { Marketplace, User } = require("../../models");
const ItemsCache = require("../../services/ItemsCache");
const itemCache = require("../../scripts/itemCache");

module.exports = async (io, socket, params) => {
  try{
    const {id} = params;
    if(!id) throw new Error('Item ID is required.');
    let item = await Marketplace.findOne({
      where: {
        item_id: id,
        finished: false,
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'avatar', 'steam_id'],
        }
      ]
    });
    if(!item) throw new Error('Item not found.');
    let similarItems = await Marketplace.findAll({
      where: {
        item_hash: item.item_hash,
        item_id: {
          [Op.ne]: item.item_id,
        },
        on_trade: false,
        finished: false,
      },
      limit: 5,
    });
    const itemInfo = await itemCache(item.item_id);
    const similarItemsInfo = await itemCache(similarItems.map(item => item.item_id));
    const itemFullInfo = {
      ...itemInfo,
      ...item.dataValues,
    }
    similarItems = similarItems.map(item => {
      const itemInfo = similarItemsInfo.find(i => i.assetid === item.item_id);
      if(!itemInfo) return item;
      return {
        ...itemInfo,
        ...item.dataValues,
      }
    })
    /*const allItems = await ItemsCache.getItems();
    const inventory = await ItemsCache.getInventory(item.user.steam_id);
    const itemInventoryInfo = inventory.find(i => i.assetid === item.item_id);
    const similarItemsInfo = similarItems.map(item => {
      const itemInfo = allItems.find(i => i.name === item.item_hash);
      return {
        ...itemInfo,
        ...item.dataValues,
      }
    });
    const itemFullInfo = {
      ...allItems.find(i => i.name === item.item_hash),
      ...item.dataValues,
      inspect_link: itemInventoryInfo.actions
    }*/
    return {
      item: itemFullInfo,
      similar_items: similarItemsInfo,
    };
  } catch(e){
    console.log(e);
    throw e;
  }
}