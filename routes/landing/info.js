const { Marketplace, MarketplaceTrade, User } = require('../../models');
const itemCache = require('../../scripts/itemCache');
const ItemsCache = require('../../services/ItemsCache');
const { Op } = require('sequelize');


module.exports = async (io, socket, params) => {
  try{
    let recentylListedItems = await Marketplace.findAll({
      limit: 5,
      order: [
        ['createdAt', 'DESC']
      ],
      where: {
        finished: false,
      }
    });
    const allItemsInfo = await itemCache(recentylListedItems.map(item => item.item_id));
    recentylListedItems = recentylListedItems.map(item => {
      const itemInfo = allItemsInfo.find(i => i.assetid === item.item_id);
      if(!itemInfo) return item;
      return {
        ...itemInfo,
        ...item.dataValues,
      }
    }).filter(item => item !== null);
    const todaySales = await MarketplaceTrade.count({
      where: {
        created_at: {
          [Op.gte]: new Date(new Date().setHours(0,0,0,0))
        }
      }
    });
    const availableItems = await Marketplace.count();
    const registeredUsers = await User.count();
    return {
      recentylListedItems,
      todaySales: todaySales,
      availableItems,
      registeredUsers,
    };
  } catch(e){
    console.log(e);
    throw e;
  }
};