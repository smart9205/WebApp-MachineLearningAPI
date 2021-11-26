'use strict';
const {
  Model, STRING
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Email_Queue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Email_Queue.init({
    user_id: DataTypes.INTEGER,
    user_email: DataTypes.STRING,
    send_date: DataTypes.DATE,
    subject: DataTypes.STRING,
    content: DataTypes.TEXT,
    success: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Email_Queue',
  });
  return Email_Queue;
};