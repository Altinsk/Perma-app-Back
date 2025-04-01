const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
    UserId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    FirstName: { type: DataTypes.STRING(100), allowNull: false },
    LastName: { type: DataTypes.STRING(100), allowNull: false },
    Email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    PasswordHash: { type: DataTypes.TEXT, allowNull: false },
    PasswordSalt: { type: DataTypes.TEXT, allowNull: false },
    Verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    DateCreated: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    DateLastUpdated: { type: DataTypes.DATE, allowNull: true },
    DateLastLogin: { type: DataTypes.DATE, allowNull: true },
    IsBlackListed: { type: DataTypes.BOOLEAN, defaultValue: false },
    IsDeleted: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
    tableName: 'Users',
    timestamps: false
});

module.exports = User;