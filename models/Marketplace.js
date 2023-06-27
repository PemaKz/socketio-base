module.exports = (sequelize, Sequelize) => {
  const Marketplace = sequelize.define('marketplace', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    item_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    item_hash: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    gun_type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    float: {
      type: Sequelize.DECIMAL(18, 16),
      allowNull: true,
    },
    price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    on_trade: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    finished: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    timestamps: true,
  });
  return Marketplace;
};