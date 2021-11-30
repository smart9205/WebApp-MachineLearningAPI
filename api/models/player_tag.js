'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Player_Tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Player_Tag.init({
    game_id: DataTypes.INTEGER,
    offensive_team_id: DataTypes.INTEGER,
    defensive_team_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Player_Tag',
  });
  return Player_Tag;
};