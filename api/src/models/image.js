const { DataTypes } = require('sequelize')
const sequelize = require('../lib/sequelize')

/*
 * Schema describing required/optional fields of a photo object.
 */
const Image = sequelize.define('image', {
  locationId: { type: DataTypes.INTEGER, required: true },
  caption: { type: DataTypes.STRING, required: false },
  file: { type: DataTypes.JSON, required: true }
})

exports.Image = Image