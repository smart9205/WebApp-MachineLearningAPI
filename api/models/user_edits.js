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
    user_id: DataTypes.INTEGER,
    processed: DataTypes.INTEGER,
    video_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User_Edits',
  });
  return User_Edits;
};