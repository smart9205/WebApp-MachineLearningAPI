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
  };//d, team_tag_id, team_id, player_id, action_id, action_type_id, action_result_id, start_time, end_time 
  Player_Tag.init({
    team_tag_id: DataTypes.INTEGER,
    team_id: DataTypes.INTEGER,
    action_id: DataTypes.INTEGER,
    action_type_id: DataTypes.INTEGER,
    action_result_id: DataTypes.INTEGER,
    start_time: DataTypes.STRING,
    end_time: DataTypes.STRING,

    game_id: DataTypes.INTEGER,
    offensive_team_id: DataTypes.INTEGER,
    defensive_team_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Player_Tag',
  });
  return Player_Tag;
};