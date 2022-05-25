/*
 * This file contains a simple script to populate the database with initial
 * data from the files in the data/ directory.
 */

const sequelize = require('./src/lib/sequelize')
const { Location, LocationClientFields } = require('./src/models/location')
const { ParkingData, ParkingDataClientFields } = require('./src/models/parkingData')

const locationData = require('./src/data/locations.json')
const parkingDataData = require('./src/data/parkingDatas.json')

sequelize.sync().then(async function () {
  await Location.bulkCreate(locationData, { fields: LocationClientFields })
  await ParkingData.bulkCreate(parkingDataData, { fields: ParkingDataClientFields })
})