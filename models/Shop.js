'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Shop extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Shop.hasMany(models.Customer);
      Shop.hasMany(models.Order);
      Shop.hasMany(models.Address);
    }
  };
  Shop.init({
    shopUrl: DataTypes.STRING,
    accessToken: DataTypes.STRING,
    shopName: DataTypes.STRING,
    shopAddress: DataTypes.STRING,
    shopCity: DataTypes.STRING,
    shopState: DataTypes.STRING,
    shopCountry: DataTypes.STRING,
    shopMail: DataTypes.STRING,
    shopLogo: DataTypes.BLOB
  }, {
    sequelize,
    modelName: 'Shop',
  });
  return Shop;
};