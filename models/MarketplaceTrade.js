module.exports = (sequelize, Sequelize) => {
  const MarketplaceTrade = sequelize.define('marketplace_trade', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    buyer_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    status: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    trade_offer_id: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    expiry_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    ended_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  });
  return MarketplaceTrade;
};