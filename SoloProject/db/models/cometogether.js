'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ComeTogether extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ComeTogether.init({
    userid: DataTypes.INTEGER,
    eventid: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ComeTogether',
  });
  return ComeTogether;
};