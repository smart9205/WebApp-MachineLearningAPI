'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Last_Updated extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Last_Updated.init({
    script_ran: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Last_Updated',
  });
  return Last_Updated;
};