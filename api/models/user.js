'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    country: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    is_verified: DataTypes.BOOLEAN,
    create_edits: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    user_image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};