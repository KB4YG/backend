const { DataTypes } = require('sequelize')

const sequelize = require('../lib/sequelize')
const { ParkingData } = require('./parkingData')
const { Image } = require('./image')

const Location = sequelize.define('location', {
  about: { type: DataTypes.STRING, required: true },
  address: { type: DataTypes.STRING, required: true },
  county: { type: DataTypes.STRING, required: true },
  fireDanger: { type: DataTypes.STRING, required: true },
  latitude: { type: DataTypes.STRING, required: true },
  location: { type: DataTypes.STRING, required: true },
  longitude: { type: DataTypes.STRING, required: true },
  parkingLotName: { type: DataTypes.STRING, required: true },
  recreationArea: { type: DataTypes.STRING, required: true },
  totalGeneral: { type: DataTypes.INTEGER, required: true },
  totalHandicap: { type: DataTypes.INTEGER, required: true }
})


/*
* Set up one-to-many relationship between Business and Photo.
*/
Location.hasMany(ParkingData, { foreignKey: { allowNull: false } })
ParkingData.belongsTo(Location)

Location.hasMany(Image, { foreignKey: { allowNull: true }})
Image.belongsTo(Location)

exports.Location = Location

/*
 * Export an array containing the names of fields the client is allowed to set
 * on businesses.
 */
exports.LocationClientFields = [
  'about',
  'address',
  'county',
  'fireDanger',
  'latitude',
  'location',
  'longitude',
  'parkingLotName',
  'recreationArea',
  'totalGeneral',
  'totalHandicap'
]
