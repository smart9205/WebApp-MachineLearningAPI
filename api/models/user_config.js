'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User_Config extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User_Config.init({
    user_id: DataTypes.INTEGER,
    sec_before: DataTypes.INTEGER,
    sec_after: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User_Config',
  });
  return User_Config;
};