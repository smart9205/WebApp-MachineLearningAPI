'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Action_Type extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Action_Type.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Action_Type',
  });
  return Action_Type;
};