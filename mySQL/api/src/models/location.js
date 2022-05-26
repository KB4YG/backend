const { DataTypes } = require('sequelize')

const sequelize = require('../lib/sequelize')
const { ParkingData } = require('./parkingData')

const Location = sequelize.define('location', {
  About: { type: DataTypes.STRING },
  Address: { type: DataTypes.STRING },
  County: { type: DataTypes.STRING },
  CountyURL: { type: DataTypes.STRING },
  FireDanger: { type: DataTypes.STRING },
  Images: { type: DataTypes.JSON },
  Latitude: { type: DataTypes.STRING },
  Location: { type: DataTypes.STRING },
  Longitude: { type: DataTypes.STRING },
  ParkingLotName: { type: DataTypes.STRING },
  ParkURL: { type: DataTypes.STRING },
  RecreationArea: { type: DataTypes.STRING },
  TotalGeneral: { type: DataTypes.INTEGER },
  TotalHandicap: { type: DataTypes.INTEGER }
})


/*
* Set up one-to-many relationship between Business and Photo.
*/
Location.hasMany(ParkingData, { foreignKey: { allowNull: false } })
ParkingData.belongsTo(Location)

exports.Location = Location

/*
 * Export an array containing the names of fields the client is allowed to set
 * on businesses.
 */
exports.LocationClientFields = [
  'About',
  'Address',
  'County',
  'CountyURL',
  'FireDanger',
  'Images',
  'Latitude',
  'Location',
  'Longitude',
  'ParkingLotName',
  'ParkURL',
  'RecreationArea',
  'TotalGeneral',
  'TotalHandicap'
]
