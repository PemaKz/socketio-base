module.exports = (sequelize, Sequelize) => {
  const RolePermission = sequelize.define('role_permissions', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    role_id: Sequelize.INTEGER,
    permission_id: Sequelize.INTEGER,
  }, { timestamps: false });
  return RolePermission;
};