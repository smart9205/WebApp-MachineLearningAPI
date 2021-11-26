'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class player extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  player.init({
    f_name: DataTypes.STRING,
    l_name: DataTypes.STRING,
    position: DataTypes.STRING,
    date_of_birth: DataTypes.DATE,
    jersey_number: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'player',
  });
  return player;
};