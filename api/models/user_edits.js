'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User_Edits extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User_Edits.init({
    name: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    parent_id: DataTypes.INTEGER,
    share_id: DataTypes.STRING,
    order_num: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User_Edits',
  });
  return User_Edits;
};