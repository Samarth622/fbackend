import { DataTypes } from 'sequelize';
import db from '../db/db.js';

const User = db.define('users', {
  uid: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },
  gender: {
    type: DataTypes.ENUM('male', 'female'),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  height: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  weight: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  allergies: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "",
  },
  medicalHistory: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "",
  },
  bloodGroup: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "",
  }
},
{
  timestamps: false
});


export default User;