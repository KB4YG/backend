const { DataTypes } = require('sequelize')
const sequelize = require('../lib/sequelize')

const ParkingData = sequelize.define('parkingData', {
  Temp: { type: DataTypes.FLOAT },
  UsedGeneral: { type: DataTypes.INTEGER },
  UsedHandicap: { type: DataTypes.INTEGER },
  Confidence: { type: DataTypes.FLOAT },
})

exports.ParkingData = ParkingData
exports.ParkingDataClientFields = [
  'LocationID',
  'Temp',
  'UsedGeneral',
  'UsedHandicap',
  'Confidence',
]
