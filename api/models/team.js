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
    team_color: DataTypes.STRING,
    second_color: DataTypes.STRING,
    sponsor_logo: DataTypes.STRING,
    sponsor_url: DataTypes.STRING,
    create_highlights: DataTypes.BOOLEAN,
    show_sponsor: DataTypes.BOOLEAN,
    team_language: DataTypes.STRING,
    filter_by_position: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Team',
  });
  return Team;
};