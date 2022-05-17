const AWS = require('aws-sdk');
//const {v4: uuidv4} = require('uuid');

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
    //const locationUpdateId = uuidv4();
   
    let About = null
    let Address = null
    let County = null
    let CountyUrl = null
    let FireDanger = null
    let Images = null
    let Latitude = null
    let Location = null
    let Longitude = null
    let ParkingLotName = null
    let ParkURL = null
    let RecreationArea = null
    let TotalGeneral = null
    let TotalHandicap = null
    
    if (event.queryStringParameters !== null && event.queryStringParameters !== undefined) {
        About = event.queryStringParameters.About
        Address = event.queryStringParameters.Address
        County = event.queryStringParameters.County
        CountyUrl = event.queryStringParameters.CountyURL
        FireDanger = event.queryStringParameters.FireDanger
        Images = event.queryStringParameters.Images
        Latitude = event.queryStringParameters.Latitude
        Longitude = event.queryStringParameters.Longitude
        Location = event.queryStringParameters.Location
        ParkingLotName = event.queryStringParameters.ParkingLotName
        ParkURL = event.queryStringParameters.ParkURL
        RecreationArea  = event.queryStringParameters.RecreationArea
        TotalGeneral = event.queryStringParameters.TotalGeneral
        TotalHandicap = event.queryStringParameters.TotalHandicap
    }
    
    const headers = {
        'Content-Type': 'application/json',
    };

    if (About === undefined || Address === undefined) {
    statusCode = '400';
    } else {
        try {
            await dynamo.put({
                TableName: "Locations",
                            Item:{
                                Id: "15751bba-ff7a-4f12-b52c-9bf1db0ac5ac",
                                About: About,
                                Address: Address,
                                County:County,
                                CountyURL: CountyUrl,
                                FireDanger:FireDanger,
                                Images: Images,
                                Latitude: Latitude,
                                Location: Location,
                                Longitude: Longitude,
                                ParkingLotName: ParkingLotName,
                                ParkURL: ParkURL,
                                RecreationArea: RecreationArea,
                                TotalGeneral: TotalGeneral,
                                TotalHandicap: TotalHandicap
                                
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
