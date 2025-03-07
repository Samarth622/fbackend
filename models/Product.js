import db from "../db/db.js";
import { DataTypes } from 'sequelize';

const Product = db.define("products", {
  pid: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nutritions: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ingredients: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
},
{
  timestamps: false
});

export default Product;