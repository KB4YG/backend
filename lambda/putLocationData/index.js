const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const Ajv = require("ajv")
const ajv = new Ajv()

const dynamo = new AWS.DynamoDB.DocumentClient();

const locationSchema = {
    type: "object",
    properties: {
        About: { type: "string" },
        Address: { type: "string" },
        County: { type: "string" },
        CountyURL: { type: "string" },
        FireDanger: { type: "string" },
        Images: { type: "array", items: { type: "string" } },
        Latitude: { type: "string" },
        Location: { type: "string" },
        Longitude: { type: "string" },
        ParkingLotName: { type: "string" },
        ParkURL: { type: "string" },
        RecreationArea: { type: "string" },
        TotalGeneral: { type: "number" },
        TotalHandicap: { type: "number" }
    },
    required: ["About", "Address", "County", "CountyURL", "FireDanger", "Images", "Latitude", "Location",
        "Longitude", "ParkingLotName", "ParkURL", "RecreationArea", "TotalGeneral", "TotalHandicap"],
    additionalProperties: false
}
const validate = ajv.compile(locationSchema)

exports.handler = async (event, context) => {
    let status = 400;
    let result

    const headers = {
        'Content-Type': 'application/json',
    };

    if (event.location) {
        if (validate(event.location)) {
            const location = event.location
            location.Id = uuidv4()
            try {
                await dynamo.put({
                    TableName: "Locations",
                    Item: location
                }).promise();
                status = 200
                result = "Successfully added location to database"
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
                body: JSON.stringify(validate.errors),
            };
            return response;
        }
    } else {
        const response = {
            headers,
            statusCode: 400,
            body: "Miss formated object 'location' not found"
        };
        return response;
    }
};