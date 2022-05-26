const { DataTypes } = require('sequelize')

const sequelize = require('../lib/sequelize')
const { ParkingData } = require('./parkingData')
const { Image } = require('./image')
const { FireDanger } = require('./fireDanger')

// Note: DataTypes.STRING is VARCHAR(255) so 255 char max unless otherwise specified
const Location = sequelize.define('location', {
  about: { type: DataTypes.STRING(1024) },
  address: { type: DataTypes.STRING },
  county: { type: DataTypes.STRING },
  countyURL: { type: DataTypes.STRING },
  displayName: { type: DataTypes.STRING },
  latitude: { type: DataTypes.STRING },
  longitude: { type: DataTypes.STRING },
  parkingLotName: { type: DataTypes.STRING },
  parkURL: { type: DataTypes.STRING },
  recreationArea: { type: DataTypes.STRING },
  totalGeneral: { type: DataTypes.INTEGER },
  totalHandicap: { type: DataTypes.INTEGER }
})

/*
* Set up one-to-many relationship between Business and Photo.
*/
Location.hasMany(ParkingData, { foreignKey: { allowNull: false } })
ParkingData.belongsTo(Location)

Location.hasMany(Image, { foreignKey: { allowNull: true }})
Image.belongsTo(Location)

Location.hasMany(FireDanger, { foreignKey: { allowNull: false }})
FireDanger.belongsTo(Location)

exports.Location = Location

/*
 * Export an array containing the names of fields the client is allowed to set
 * on businesses.
 */
exports.LocationClientFields = [
  'about',
  'address',
  'county',
  'countyURL',
  'displayName',
  'latitude',
  'longitude',
  'parkingLotName',
  'parkURL',
  'recreationArea',
  'totalGeneral',
  'totalHandicap'
]
