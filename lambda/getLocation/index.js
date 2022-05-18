const AWS = require('aws-sdk');

const Ajv = require("ajv")
const ajv = new Ajv()

const dynamo = new AWS.DynamoDB.DocumentClient();

 const getParkingData = async () => {
     let res;
     try {
          res = await dynamo.scan({ 
                TableName: "ParkingLotData"
            }).promise();
     } catch (err) {
         console.log(err)
     }
     if (res !== undefined) return res.Items;
 }

 const querySchema = {
    type: "object",
    properties: {
        ParkingLotName: { type: "string" },
        RecreationArea: { type: "string" },
        CountyURL: { type: "string" },
        ParkURL: { type: "string" }
    },
    additionalProperties: false
}
const validate = ajv.compile(querySchema)
 
exports.handler = async (event, context) => {
    let status = 400;

    const headers = {
        'Content-Type': 'application/json',
    };

    if (event.queryStringParameters && validate(event.queryStringParameters)) {
        const query = event.queryStringParameters
        
        try {
            result = await dynamo.scan({ 
                TableName: "Locations"
            }).promise();
            
            result = result.Items;
            
            let parkingData = await getParkingData()
            
            console.log(parkingData)
            
            if (query.ParkingLotName){ // Get location data by parking lot name
                result = result.filter(location => location.ParkingLotName == query.ParkingLotName)
                result = result.map(item => {
                    item = {...item, ParkingData:
                                            parkingData
                                            .sort((a, b) => b.LastUpdate - a.LastUpdate)
                                            .filter(parkingLot => parkingLot.ParkingLotId == item.Id)}
                    return item
                })
            } 
            else if (query.ParkURL){ // Get location data by park URL
                result = result.filter(location => location.ParkURL == query.ParkURL);
                result = result.map(item => {
                    item = {...item, ParkingData: 
                                        parkingData
                                        .sort((a, b) => b.LastUpdate - a.LastUpdate)
                                        .filter(parkingLot => parkingLot.ParkingLotId == item.Id)}
                    return item
                })
            
                result = {RecreationArea: result[0].RecreationArea,
                        About: result[0].About,
                        Images: result[0].Images,
                        List : result
                        }
                        
    
            } 
            else if (query.RecreationArea){ // Get location data by recreation area
                result = result.filter(location => location.RecreationArea == query.RecreationArea)
                result = result.map(item => {
                    item = {...item, ParkingData: 
                                            parkingData
                                            .sort((a, b) => b.LastUpdate - a.LastUpdate)
                                            .filter(parkingLot => parkingLot.ParkingLotId == item.Id)}
                    return item
                    })
                result = {RecreationArea: result[0].RecreationArea,
                        About: result[0].About,
                        Images: result[0].Images,
                        List : result
                        }
            }
            else if  (query.CountyURL && query.CountyURL === "all"){ // Get list of all countrys
                var counties = [];
                for(var i = 0; i<result.length;i++){
                    counties.push(result[i].County)
                }
                result = {Counties :[...new Set(counties)]}
            }
            else if (query.CountyURL){ // Get location data by county url
                result = result.filter(location => location.CountyURL == query.CountyURL);
                result = result.map(item => {
                    item = {...item, ParkingData: 
                                parkingData
                                .sort((a, b) => b.LastUpdate - a.LastUpdate)
                                .filter(parkingLot => parkingLot.ParkingLotId == item.Id)}
                    return item
                })
                console.log("result")
                console.log(JSON.stringify(result))
                console.log("result")
                console.log(JSON.stringify(result))
                var recAreas = [];
                for(var i = 0; i<result.length;i++){
                    recAreas.push(result[i].RecreationArea)
                }
                let long = result[0].Longitude;
                let lat = result[0].Latitude;
                recAreas =  [...new Set(recAreas)];
                console.log(recAreas)
                let map = [];
                
                for (var i =0; i<recAreas.length;i++){
                    map.push(new Map());
                    map[i].set("RecreationArea", recAreas[i]);
                    map[i].set("List", []);
                    
                    for(let j = 0; j<result.length; j++){
                        console.log(result.length)
                        console.log(j)
                        if(result!=[] && result[j].RecreationArea==recAreas[i]){
                            map[i].get("List").push(result.splice(j, 1)[0]);
                            j--;
                        }
                        console.log(result.length)
                        console.log(j)
                        
                    }
                    console.log("map")
                    console.log(map[i]);
                    map[i].set("Images", map[i].get("List")[0].Images)
                    map[i].set("About", map[i].get("List")[0].About)
                    
                }
                
                let obj = Object.create(null);
                for (var i =0; i<recAreas.length;i++){
                    for (let [k,v] of map[i]) {
                        obj[k] = v;
                    }
                    map[i] = obj
                }
                query.CountyURL = query.CountyURL.substring(1);
                query.CountyURL = query.CountyURL.charAt(0).toUpperCase() + query.CountyURL.substring(1);
                result = { County : query.CountyURL,
                        Longitude: long,
                        Latitude: lat,
                        List : map};
                        
            }
            else{
                result = body.map(item => {
                    item = {...item, ParkingData: 
                        parkingData
                        .sort((a, b) => b.LastUpdate - a.LastUpdate)
                        .filter(parkingLot => parkingLot.ParkingLotId == item.Id)
                    }
                    return item
                })
    
            }
    
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
};
