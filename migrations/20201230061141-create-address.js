'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Addresses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      customerId: {
        type: Sequelize.INTEGER
      },
      shippingAddress1: {
        type: Sequelize.STRING
      },
      shippingAddress2: {
        type: Sequelize.STRING
      },
      shippingCity: {
        type: Sequelize.STRING
      },
      shippingState: {
        type: Sequelize.STRING
      },
      shippingZip: {
        type: Sequelize.INTEGER
      },
      billingAddress1: {
        type: Sequelize.STRING
      },
      billingAddress2: {
        type: Sequelize.STRING
      },
      billingCity: {
        type: Sequelize.STRING
      },
      billingState: {
        type: Sequelize.STRING
      },
      billingCount: {
        type: Sequelize.STRING
      },
      billingZip: {
        type: Sequelize.INTEGER
      },
      shopId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Addresses');
  }
};