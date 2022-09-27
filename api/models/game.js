"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Game extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Game.init(
    {
      season_id: DataTypes.INTEGER,
      league_id: DataTypes.INTEGER,
      date: DataTypes.DATE,
      home_team_id: DataTypes.INTEGER,
      away_team_id: DataTypes.INTEGER,
      video_url: DataTypes.STRING,
      mobile_video_url: DataTypes.STRING,
      image: DataTypes.STRING,
      mute_video: DataTypes.BOOLEAN,
      done_tagging: DataTypes.BOOLEAN,
      home_team_standing_id: DataTypes.INTEGER,
      away_team_standing_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Game",
    }
  );
  return Game;
};
