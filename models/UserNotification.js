module.exports = (sequelize, Sequelize) => {
  const UserNotification = sequelize.define('user_notification', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    message: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    read: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  }, {
    timestamps: true
  });
  return UserNotification;
};