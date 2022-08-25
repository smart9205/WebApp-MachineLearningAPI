'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User_Edits_Folders extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    User_Edits_Folders.init({
        name: DataTypes.STRING,
        user_id: DataTypes.INTEGER,
        parent_id: DataTypes.INTEGER,
        order_num: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'User_Edits_Folders',
    });
    return User_Edits_Folders;
};