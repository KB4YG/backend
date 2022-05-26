const AWS = require('aws-sdk');

const Ajv = require("ajv")
const ajv = new Ajv()

const dynamo = new AWS.DynamoDB.DocumentClient();
const DB = {
    locations: "Locations",
    parkingData: "ParkingLotData"
}
const querySchema = {
    type: "object",
    properties: {
        CountyURL: { type: "string" },
        ParkURL: { type: "string" }
    },
    additionalProperties: false
}
const validate = ajv.compile(querySchema)


// DynamoDB is not good at querying for non key values:
// Should either switch to new DB or create new table with sort key by time
// https://stackoverflow.com/questions/9297326/is-it-possible-to-order-results-with-query-or-scan-in-dynamodb
const getLatestParkingData = async (lotID) => {
    try {
        const params = {
            FilterExpression: "ParkingLotId = :lotID",
            ExpressionAttributeValues: {
                ':lotID': lotID
            },
            // ScanIndexForward: false, 
            // limit: 1,
            TableName: DB.parkingData
        };
        var data = await dynamo.scan(params).promise()
        data = data.Items.sort((a, b) => b.LastUpdate - a.LastUpdate)

        return data[0]

    } catch (error) {
        console.error(error);
        return error;
    }
}

// Get RecreationArea () object based off ParkURL
const getRecAreaByUrl = async (ParkURL) => {
    try {
        const params = {
            FilterExpression: "ParkURL = :ParkURL",
            ExpressionAttributeValues: {
                ':ParkURL': ParkURL
            },
            TableName: DB.locations
        };
        var locations = await dynamo.scan(params).promise()

        for (const lot of locations.Items) {
            lot.ParkingData = await getLatestParkingData(lot.Id)
        }

        const result = {
            "RecreationArea": locations.Items[0].RecreationArea,
            "About": locations.Items[0].About,
            "Images": locations.Items[0].Images,
            "parkingLots": locations.Items
        }
        return result
    } catch (error) {
        console.error(error);
        return error;
    }
}

const getCounties = async () => {
    try {
        const params = {
            TableName: DB.locations
        };
        var locations = await dynamo.scan(params).promise()
        body = locations.Items

        var counties = [];
        for (const local of locations.Items) {
            counties.push(local.County)
        }
        const result = { Counties: [...new Set(counties)] }
        return result
    } catch (error) {
        console.error(error);
        return error;
    }
}

const getParkingLots = async () => {
    try {
        const params = {
            TableName: DB.locations
        };
        var locations = await dynamo.scan(params).promise()

        for (const lot of locations.Items) {
            lot.ParkingData = await getLatestParkingData(lot.Id)
        }

        const result = locations.Items
        return result
    } catch (error) {
        console.error(error);
        return error;
    }
}

const getCountyByURL = async (CountyURL) => {
    try {
        const params = {
            FilterExpression: "CountyURL = :CountyURL",
            ExpressionAttributeValues: {
                ':CountyURL': CountyURL
            },
            TableName: DB.locations
        };
        var locations = await dynamo.scan(params).promise()

        for (const lot of locations.Items) {
            lot.ParkingData = await getLatestParkingData(lot.Id)
        }

        const result = {
            "County": locations.Items[0].County,
            "Longitude": locations.Items[0].Longitude,
            "Latitude": locations.Items[0].Latitude,
            "parkingLots": locations.Items
        }
        return result
    } catch (error) {
        console.error(error);
        return error;
    }
}

exports.handler = async (event, context) => {
    let status = 400;
    let result;

    const headers = {
        'Content-Type': 'application/json',
    };

    if (event.queryStringParameters && validate(event.queryStringParameters)) {
        const query = event.queryStringParameters

        try {
            if (query.ParkURL) { // Get location data by park URL
                result = await getRecAreaByUrl(query.ParkURL)
                status = 200;
            }
            else if (query.CountyURL && query.CountyURL === "all") { // Get list of all countries
                result = await getCounties()
                status = 200;
            }
            else if (query.CountyURL) { // Get location data by county url
                result = await getCountyByURL(query.CountyURL)
                status = 200;
            }
            else {
                result = await getParkingLots()
                status = 200;
            }
        } catch (err) {
            status = 400;
            result = err.message;
        } finally {
            const response = {
                headers,
                statusCode: status,
                body: result,
            };
            return response;
        }
    } else {
        const response = {
            headers,
            statusCode: 400,
            body: JSON.stringify(validate.errors),
        };
        return response;
    }
};
