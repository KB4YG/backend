const AWS = require('aws-sdk');
const {v4: uuidv4} = require('uuid');

const Ajv = require("ajv")
const ajv = new Ajv()

const dynamo = new AWS.DynamoDB.DocumentClient();

const locationDataSchema = {
    type: "object",
    properties: {
        ParkingLotId: { type: "string" },
        Temp: { type: "number" },
        UsedGeneral: { type: "number" },
        UsedHandicap: { type: "number" },
        Confidence: { type: "number" } // might need to be float32
    },
    required: ["ParkingLotId", "Temp", "UsedGeneral", "UsedHandicap", "Confidence"],
    additionalProperties: false
}
const validate = ajv.compile(locationDataSchema)

exports.handler = async (event, context) => {
    let status = 400;

    const headers = {
        'Content-Type': 'application/json',
    };

    if (event.queryStringParameters && validate(event.queryStringParameters)) {
        const locationData = event.queryStringParameters
        locationData[Id] = uuidv4()
        locationData[LastUpdate] = Date.now()
        try {
            await dynamo.put({
                TableName: "ParkingLotData",
                Item: {
                    locationData
                }
            }).promise();
            status = 200
            result = "Successfully added location data to database"
        } catch (err) {
            status = 400;
            result = err.message;
        } finally {
            body = JSON.stringify(body);
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
}