const { DataTypes } = require('sequelize')
const sequelize = require('../lib/sequelize')

const ParkingData = sequelize.define('parkingData', {
  confidence: { type: DataTypes.FLOAT, required: true },
  temp: { type: DataTypes.FLOAT, required: true },
  usedGeneral: { type: DataTypes.INTEGER, required: true },
  usedHandicap: { type: DataTypes.INTEGER, required: true }
})

async function getLatestData(locationId){
  return await ParkingData.findOne({
      where: { locationId: locationId },
      order: [['createdAt', 'DESC']]
  })
}
exports.getLatestData = getLatestData

exports.ParkingData = ParkingData
exports.ParkingDataClientFields = [
  'confidence',
  'dateTime',
  'locationId',
  'temp',
  'usedGeneral',
  'usedHandicap'
]
