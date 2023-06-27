const { Marketplace, User } = require("../../models");
const itemCache = require("../../scripts/itemCache");
const ItemsCache = require("../../services/ItemsCache");
const { Op } = require("sequelize");

module.exports = async (io, socket, params)=> {
  try{
    let {page, limit, status, type, gun_type, search, sort } = params;
    page = Number(page) ? Number(page) : 1;
    limit = Number(limit) ? Number(limit) : 10;
    let where = {
      on_trade: false,
      finished: false,
    };
    if(status !== undefined) where.status = status;
    if(type !== undefined) where.type = type;
    if(gun_type !== undefined) where.gun_type = gun_type;
    if(search !== undefined) where.item_hash = {
      [Op.like]: `%${search}%`
    }
    let items = await Marketplace.findAll({
      limit,
      offset: limit * (page - 1),
      where,
      order: [fetchSort(sort)],
    });
    let itemsCount = await Marketplace.count({where});
    const allItemsInfo = await itemCache(items.map(item => item.item_id));
    items = items.map(item => {
      const itemInfo = allItemsInfo.find(i => i.assetid === item.item_id);
      if(!itemInfo) return item;
      return {
        ...itemInfo,
        ...item.dataValues,
      }
    })
    return {items, total: Math.ceil(itemsCount / limit)}
  } catch(e){
    console.log(e);
    throw e;
  }
}

const fetchSort = (sortValue) => {
  switch(sortValue){
    case 'lowest_price':
      return ['price', 'ASC'];
    case 'highest_price':
      return ['price', 'DESC'];
    case 'published_date':
      return ['createdAt', 'DESC'];
    default:
      return ['id', 'DESC'];
  }
}