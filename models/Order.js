'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.hasMany(models.OrdersDetail);
      Order.belongsTo(models.Customer);
      Order.belongsTo(models.Shop);
    }
  };
  Order.init({
    order_no: DataTypes.INTEGER,
    customerId: DataTypes.INTEGER,
    shopId: DataTypes.INTEGER,
    orderDate: DataTypes.DATE,
    shippingDate: DataTypes.DATE,
    totalAmount: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};