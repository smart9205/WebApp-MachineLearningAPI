"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Corrections extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Corrections.init(
    {
      old_player_id: DataTypes.INTEGER,
      new_player_id: DataTypes.INTEGER,
      player_tag_id: DataTypes.INTEGER,
      accepted_by_coach_id: DataTypes.INTEGER,
      done_correction: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Corrections",
    }
  );
  return Corrections;
};
