'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Address.belongsTo(models.Customer);
      Address.belongsTo(models.Shop);
    }
  };
  Address.init({
    customerId: DataTypes.INTEGER,
    shippingAddress1: DataTypes.STRING,
    shippingAddress2: DataTypes.STRING,
    shippingCity: DataTypes.STRING,
    shippingState: DataTypes.STRING,
    shippingZip: DataTypes.INTEGER,
    billingAddress1: DataTypes.STRING,
    billingAddress2: DataTypes.STRING,
    billingCity: DataTypes.STRING,
    billingState: DataTypes.STRING,
    billingCount: DataTypes.STRING,
    billingZip: DataTypes.INTEGER,
    shopId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Address',
  });
  return Address;
};