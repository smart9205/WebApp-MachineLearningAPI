'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Game extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Game.init({
    season_id: DataTypes.INTEGER,
    league_id: DataTypes.INTEGER,
    date: DataTypes.DATE,
    home_team_id: DataTypes.INTEGER,
    away_team_id: DataTypes.INTEGER,
    video_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Game',
  });
  return Game;
};
