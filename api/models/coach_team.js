'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Coach_Team extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Coach_Team.init({
    user_id: DataTypes.INTEGER,
    season_id: DataTypes.INTEGER,
    league_id: DataTypes.INTEGER,
    team_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Coach_Team',
  });
  return Coach_Team;
};