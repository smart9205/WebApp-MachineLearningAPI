'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Team_Tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Team_Tag.init({
    game_id: DataTypes.INTEGER,
    offensive_team_id: DataTypes.INTEGER,
    defensive_team_id: DataTypes.INTEGER,
    start_time: DataTypes.STRING,
    end_time: DataTypes.STRING,
    period: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Team_Tag',
  });
  return Team_Tag;
};