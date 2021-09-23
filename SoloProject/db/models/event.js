'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      // define association here
      this.belongsTo(User, { foreignKey: 'owner' });
      this.belongsToMany(User, { through: 'ComeTogethers', foreignKey: 'eventid' });
    }
  }
  Event.init(
    {
      title: DataTypes.STRING,
      text: DataTypes.TEXT,
      owner: DataTypes.INTEGER,
      coordinatx: DataTypes.TEXT,
      coordinaty: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'Event',
    }
  );
  return Event;
};
