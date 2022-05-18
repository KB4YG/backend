const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB.DocumentClient();

/**
 * Demonstrates a simple HTTP endpoint using API Gateway. You have full
 * access to the request and response payload, including headers and
 * status code.
 *
 * To scan a DynamoDB table, make a GET request with the TableName as a
 * query string parameter. To put, update, or delete an item, make a POST,
 * PUT, or DELETE request respectively, passing in the payload to the
 * DynamoDB API as a JSON body.
 */
exports.handler = async (event, context) => {

    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
    };
    
    let parkingLotId = null
    if (event.queryStringParameters !== undefined) {
        parkingLotId = event.queryStringParameters.parkingLotId
    }
    
    try {
        if (parkingLotId !== null) {
            body = await dynamo.scan({ 
                TableName: "ParkingLotData",
                FilterExpression: "ParkingLotId = :ParkingLotId",
                ExpressionAttributeValues: {
                    ":ParkingLotId": parkingLotId
                }
            }).promise();
        } else {
            body = await dynamo.scan({ 
                TableName: "ParkingLotData"
            }).promise();
        }

    } catch (err) {
        statusCode = '400';
        body = err.message
    } finally {
        console.log(body)
        console.log(JSON.stringify(body))
        if (statusCode === '200') body = body.Items;
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers,
    };
};
