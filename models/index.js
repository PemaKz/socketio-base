const Sequelize = require("sequelize");

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mariadb',
  operatorsAliases: 0,
  port: process.env.DB_PORT,
  pool: {
    max: 50,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: false
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./User')(sequelize, Sequelize);
db.UserNotification = require('./UserNotification')(sequelize, Sequelize);
db.Permission = require('./Permission')(sequelize, Sequelize);
db.UserPermission = require('./UserPermission')(sequelize, Sequelize);
db.Role = require('./Role')(sequelize, Sequelize);
db.RolePermission = require('./RolePermission')(sequelize, Sequelize);
db.Marketplace = require('./Marketplace')(sequelize, Sequelize);
db.MarketplaceTrade = require('./MarketplaceTrade')(sequelize, Sequelize);
db.Deposit = require('./Deposit')(sequelize, Sequelize);
db.Withdraw = require('./Withdraw')(sequelize, Sequelize);

db.User.belongsToMany(db.Permission, { through: db.UserPermission, foreignKey: 'user_id', otherKey: 'permission_id' });
db.Permission.belongsToMany(db.User, { through: db.UserPermission, foreignKey: 'permission_id', otherKey: 'user_id' });

db.Role.belongsToMany(db.Permission, { through: db.RolePermission, foreignKey: 'role_id', otherKey: 'permission_id' });
db.Permission.belongsToMany(db.Role, { through: db.RolePermission, foreignKey: 'permission_id', otherKey: 'role_id' });

db.Role.hasOne(db.User, { foreignKey: 'role_id' , sourceKey: 'id' });
db.User.belongsTo(db.Role, { foreignKey: 'role_id' , targetKey: 'id' });

db.User.hasMany(db.UserNotification, { foreignKey: 'user_id' , sourceKey: 'id' });
db.UserNotification.belongsTo(db.User, { foreignKey: 'user_id' , targetKey: 'id' });

db.Marketplace.hasMany(db.MarketplaceTrade, { foreignKey: 'marketplace_id' });
db.MarketplaceTrade.belongsTo(db.Marketplace, { foreignKey: 'marketplace_id' });

db.User.hasMany(db.MarketplaceTrade, { foreignKey: 'buyer_id' });
db.MarketplaceTrade.belongsTo(db.User, { foreignKey: 'buyer_id' });

db.User.hasMany(db.Marketplace, { foreignKey: 'user_id' });
db.Marketplace.belongsTo(db.User, { foreignKey: 'user_id' });

db.User.hasMany(db.Deposit, { foreignKey: 'user_id' });
db.Deposit.belongsTo(db.User, { foreignKey: 'user_id' });

db.User.hasMany(db.Withdraw, { foreignKey: 'user_id' });
db.Withdraw.belongsTo(db.User, { foreignKey: 'user_id' });

module.exports = db;