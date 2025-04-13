/*module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Activity', {
      type: DataTypes.STRING, // 'beh', 'chôdza'
      distance: DataTypes.FLOAT,
      duration: DataTypes.INTEGER, // v sekundách
    });
  };*/

/*const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Activity = sequelize.define('Activity', {
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  distance: {
    type: DataTypes.FLOAT
  },
  duration: {
    type: DataTypes.INTEGER
  }
}, {
  tableName: 'activities',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Activity;*/




const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Activity', {
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    distance: {
      type: DataTypes.FLOAT
    },
    duration: {
      type: DataTypes.INTEGER
    }
  }, {
    tableName: 'activities',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });
};