'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Player_Position extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Player_Position.init({
    name: DataTypes.STRING,
    short: DataTypes.STRING,
    sort_order: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Player_Position',
  });
  return Player_Position;
};