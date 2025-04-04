const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const User = sequelize.define(
  "User",
  {
    UserId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    FirstName: { type: DataTypes.STRING(100), allowNull: false },
    LastName: { type: DataTypes.STRING(100), allowNull: false },
    Email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    PasswordHash: { type: DataTypes.TEXT, allowNull: true },
    PasswordSalt: { type: DataTypes.TEXT, allowNull: true },
    Verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    DateCreated: {
      type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW,
    },
    DateLastUpdated: { type: DataTypes.DATE, allowNull: true },
    DateLastLogin: { type: DataTypes.DATE, allowNull: true },
    IsBlackListed: { type: DataTypes.BOOLEAN, defaultValue: false },
    IsDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    loginType: { type: DataTypes.STRING(20), allowNull: true },
    AuthToken: { type: DataTypes.STRING(255), allowNull: true },
  },
  {
    tableName: "Users",
    timestamps: false,
  }
);

module.exports = User;