'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Player extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Player.init({
    f_name: DataTypes.STRING,
    l_name: DataTypes.STRING,
    position: DataTypes.INTEGER,
    date_of_birth: DataTypes.DATE,
    jersey_number: DataTypes.INTEGER,
    image: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Player',
  });
  return Player;
};