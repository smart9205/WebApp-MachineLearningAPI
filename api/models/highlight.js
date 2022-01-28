'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Highlight extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Highlight.init({
    player_id: DataTypes.INTEGER,
    game_id: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    video_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Highlight',
  });
  return Highlight;
};