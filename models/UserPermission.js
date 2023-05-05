module.exports = (sequelize, Sequelize) => {
  const UserPermission = sequelize.define('user_permissions', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: Sequelize.INTEGER,
    permission_id: Sequelize.INTEGER,
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });
  return UserPermission;
};