const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

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
        Confidence: { type: "number" }
    },
    required: ["ParkingLotId", "Temp", "UsedGeneral", "UsedHandicap", "Confidence"],
    additionalProperties: true //Set to false once OpenGeneral is removed
}
const validate = ajv.compile(locationDataSchema)

exports.handler = async (event, context) => {
    let status = 400;

    const headers = {
        'Content-Type': 'application/json',
    };

    if (event.state.reported) {
        if (validate(event.state.reported)) {
            let result
            let locationData = event.state.reported
            locationData.Id = uuidv4()
            locationData.LastUpdate = Date.now()
            try {
                await dynamo.put({
                    TableName: "ParkingLotData",
                    Item: locationData
                }).promise();
                status = 200
                result = "Successfully added location data to database"
            } catch (err) {
                status = 400;
                result = err.message;
            } finally {
                const response = {
                    headers,
                    statusCode: status,
                    body: JSON.stringify(result),
                };
                return response;
            }
        } else {
            const response = {
                headers,
                statusCode: 400,
                body: JSON.stringify(validate.errors)
            };
            return response;
        }
    } else {
        const response = {
            headers,
            statusCode: 400,
            body: "Miss formated object 'state.reported' not found"
        };
        return response;
    }
}