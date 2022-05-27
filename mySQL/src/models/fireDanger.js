const { DataTypes } = require('sequelize')
const sequelize = require('../lib/sequelize')

/*
 * Schema describing required/optional fields of a photo object.
 */
const FireDanger = sequelize.define('fireDanger', {
  locationId: { type: DataTypes.INTEGER, required: true },
  level: { type: DataTypes.STRING, required: false },
  url: { type: DataTypes.STRING, required: true }
})

exports.FireDanger = FireDanger

exports.ImageClientFields = [
  'locationId',
  'Level',
  'url'
]