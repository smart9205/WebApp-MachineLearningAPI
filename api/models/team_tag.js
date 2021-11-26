'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class team_tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  team_tag.init({
    game_id: DataTypes.INTEGER,
    offensive_team_id: DataTypes.INTEGER,
    defensive_team_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'team_tag',
  });
  return team_tag;
};