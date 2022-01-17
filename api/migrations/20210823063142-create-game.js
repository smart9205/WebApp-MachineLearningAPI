'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Games', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      season_id: {
        type: Sequelize.INTEGER
      },
      league_id: {
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATE
      },
      home_team_id: {
        type: Sequelize.INTEGER
      },
      away_team_id: {
        type: Sequelize.INTEGER
      },
      video_url: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Games');
  }
};