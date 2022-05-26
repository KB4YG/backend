const { DataTypes } = require('sequelize')

const User = sequelize.define('user', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false }
})

exports.User = User

exports.UserClientFields = [
    'name',
    'email',
    'password'
]