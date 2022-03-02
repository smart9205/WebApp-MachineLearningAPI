'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Edit_Clips extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Edit_Clips.init({
    edit_id: DataTypes.INTEGER,
    start_time: DataTypes.STRING,
    end_time: DataTypes.STRING,
    offensive_team_id: DataTypes.INTEGER,
    defensive_team_id: DataTypes.INTEGER,
    player_id: DataTypes.INTEGER,
    action_id: DataTypes.INTEGER,
    action_type_id: DataTypes.INTEGER,
    action_result_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Edit_Clips',
  });
  return Edit_Clips;
};