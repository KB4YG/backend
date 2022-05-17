const AWS = require('aws-sdk');
const {v4: uuidv4} = require('uuid');

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
    
    const now = Date.now();
    const locationUpdateId = uuidv4();
   
    
    const headers = {
        'Content-Type': 'application/json',
    };

    if (event.state.reported.OpenGeneral === undefined || event.state.reported.OpenHandicap === undefined) {
    statusCode = '400';
    } else {
        try {
            await dynamo.put({
                TableName: "ParkingLotData",
                            Item:{
                                Id: locationUpdateId, 
                                ParkingLotId: event.state.reported.LocationId,
                                LastUpdate: now,
                                Temp: parseFloat(event.state.reported.Temp),
                                OpenGeneral: parseInt(event.state.reported.OpenGeneral),
                                OpenHandicap: parseInt(event.state.reported.OpenHandicap),
                                UsedGeneral: parseInt(event.state.reported.UsedGeneral),
                                UsedHandicap: parseInt(event.state.reported.UsedHandicap),
                                Confidence: parseFloat(event.state.reported.Confidence)
                                
                            }
            
            }).promise();
        } catch (err) {
            statusCode = '400';
            body = err.message;
        } finally {
            body = JSON.stringify(body);
        }
    }
    return {
        statusCode,
        body,
        headers,
    };
};
