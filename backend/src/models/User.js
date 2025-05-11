/*module.exports = (sequelize, DataTypes) => {
    return sequelize.define('User', {
      email: { type: DataTypes.STRING, unique: true },
      password: DataTypes.STRING,
      role: DataTypes.STRING, // 'user' alebo 'trainer'
    });
  };

  const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = User;*/




const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firebaseUid: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      field: 'firebase_uid'
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    height: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    daily_steps_goal: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 5971
    },
    daily_distance_goal: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 5.0
    },
    push_token: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });
};