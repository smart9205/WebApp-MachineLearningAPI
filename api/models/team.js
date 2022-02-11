'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Team extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Team.init({
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    Team_color: DataTypes.STRING,
    Sponsor_logo: DataTypes.STRING,
    Sponsor_url: DataTypes.STRING,
    Create_highlights: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Team',
  });
  return Team;
};