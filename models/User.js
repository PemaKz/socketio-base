const crypto = require('crypto');
const cache = require('../services/Cache');

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('user', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    avatar: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    balance: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    verified: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    banned: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['username']
      }
    ]
  });
  User.beforeCreate(async (user, options) => {
    try {
      user.password = crypto.pbkdf2Sync(user.password, process.env.ENCRYPTION_SALT, 1000, 64, `sha512`).toString(`hex`);
      user.role_id = process.env.DEFAULT_ROLE;
    } catch (err) {
      throw err;
    }
  });
  User.prototype.updatePassword = function(password) {
    return new Promise(async (resolve, reject) => {
      try {
        const hash = crypto.pbkdf2Sync(password, process.env.ENCRYPTION_SALT, 1000, 64, `sha512`).toString(`hex`);
        this.password = hash;
        await this.save();
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  };
  User.prototype.validPassword = function(password) {
    try {
      const hash = crypto.pbkdf2Sync(password, process.env.ENCRYPTION_SALT, 1000, 64, `sha512`).toString(`hex`);
      return this.password === hash;
    } catch (err) {
      throw err;
    }
  };
  User.prototype.generateAuthToken = function() {
    return new Promise(async (resolve, reject) => {
      try {
        const token = crypto.randomBytes(64).toString('hex');
        await cache.set(`userTokens:${token}:${this.id}`, this.id);
        await cache.expire(`userTokens:${token}:${this.id}`, 60 * 60 * 24 * 7);
        resolve(token);
      } catch (err) {
        reject(err);
      }
    });
  };
  User.prototype.getAuthTokens = function() {
    return new Promise(async (resolve, reject) => {
      try {
        const tokenKeys = await cache.keys(`userTokens:*:${this.id}`);
        const tokens = tokenKeys.map(tokenKey => tokenKey.split(':')[1]);
        const tokensWithExpire = await Promise.all(tokens.map(async token => {
          const expire = await cache.ttl(`userTokens:${token}:${this.id}`);
          return { token, expire };
        }));
        resolve(tokensWithExpire);
      } catch (err) {
        reject(err);
      }
    });
  };
  User.prototype.removeAuthToken = function(token) {
    return new Promise(async (resolve, reject) => {
      try {
        await cache.del(`userTokens:${token}:${this.id}`);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  };
  return User;
};