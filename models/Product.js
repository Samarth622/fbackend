import db from "../db/db.js";
import { DataTypes } from 'sequelize';

const Product = db.define("products", {
  pid: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: false,
  },
  category: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  nutritions: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  ingredients: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image_url: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
},
{
  timestamps: false
});

export default Product;