const { DataTypes } = require('sequelize')
const sequelize = require('../lib/sequelize')

const ParkingData = sequelize.define('parkingData', {
  confidence: { type: DataTypes.FLOAT, required: true },
  dateTime: { type: DataTypes.STRING, required: false },
  temp: { type: DataTypes.FLOAT, required: true },
  usedGeneral: { type: DataTypes.INTEGER, required: true },
  usedHandicap: { type: DataTypes.INTEGER, required: true }
})

exports.ParkingData = ParkingData
exports.ParkingDataClientFields = [
  'confidence',
  'dateTime',
  'locationId',
  'temp',
  'usedGeneral',
  'usedHandicap'
]
