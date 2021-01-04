'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Shops', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      shopUrl: {
        type: Sequelize.STRING
      },
      accessToken: {
        type: Sequelize.STRING
      },
      shopName: {
        type: Sequelize.STRING
      },
      shopAddress: {
        type: Sequelize.STRING
      },
      shopCity: {
        type: Sequelize.STRING
      },
      shopState: {
        type: Sequelize.STRING
      },
      shopCountry: {
        type: Sequelize.STRING
      },
      shopMail: {
        type: Sequelize.STRING
      },
      shopLogo: {
        type: Sequelize.BLOB
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
    await queryInterface.dropTable('Shops');
  }
};