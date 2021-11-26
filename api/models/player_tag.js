'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class player_tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  player_tag.init({
    game_id: DataTypes.INTEGER,
    team_tag_id: DataTypes.INTEGER,
    team_id: DataTypes.INTEGER,
    action_id: DataTypes.INTEGER,
    action_type_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'player_tag',
  });
  return player_tag;
};