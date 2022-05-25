const { DataTypes } = require('sequelize')
const sequelize = require('../lib/sequelize')

const ParkingData = sequelize.define('parkingData', {
  confidence: { type: DataTypes.FLOAT, required: true },
  temp: { type: DataTypes.FLOAT, required: true },
  usedGeneral: { type: DataTypes.INTEGER, required: true },
  usedHandicap: { type: DataTypes.INTEGER, required: true }
})

exports.ParkingData = ParkingData
exports.ParkingDataClientFields = [
  'confidence',
  'locationId',
  'temp',
  'usedGeneral',
  'usedHandicap'
]
