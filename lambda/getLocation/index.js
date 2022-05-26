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
 
exports.handler = async (event, context) => {

    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
    };
    
    let parkingLotNameFilter = null
    let recreationAreaFilter = null
    let countyFilter = null
    let parkUrlFilter = null
    
    if (event.queryStringParameters !== null && event.queryStringParameters !== undefined) {
        parkingLotNameFilter = event.queryStringParameters.ParkingLotName
        recreationAreaFilter = event.queryStringParameters.RecreationArea
        countyFilter = event.queryStringParameters.CountyURL
        parkUrlFilter = event.queryStringParameters.ParkURL
    }


    try {
        body = await dynamo.scan({ 
            TableName: "Locations"
        }).promise();
        
        body = body.Items;
        
        let parkingData = await getParkingData()
        
        console.log(parkingData)
        
        if (parkingLotNameFilter !== null && parkingLotNameFilter !== undefined){
            body = body.filter(location => location.ParkingLotName == parkingLotNameFilter)
            body = body.map(item => {
                item = {...item, ParkingData:
                                        parkingData
                                        .sort((a, b) => b.LastUpdate - a.LastUpdate)
                                        .filter(parkingLot => parkingLot.ParkingLotId == item.Id)}
                return item
            })
        } 
        else if (parkUrlFilter !== null && parkUrlFilter !== undefined){
            body = body.filter(location => location.ParkURL == parkUrlFilter);
            body = body.map(item => {
                item = {...item, ParkingData: 
                                    parkingData
                                    .sort((a, b) => b.LastUpdate - a.LastUpdate)
                                    .filter(parkingLot => parkingLot.ParkingLotId == item.Id)}
                return item
            })
        
            body = {RecreationArea: body[0].RecreationArea,
                    About: body[0].About,
                    Images: body[0].Images,
                    List : body
                    }
                    

        } 
        else if (recreationAreaFilter !== null && recreationAreaFilter !== undefined){
            body = body.filter(location => location.RecreationArea == recreationAreaFilter)
            body = body.map(item => {
                item = {...item, ParkingData: 
                                        parkingData
                                        .sort((a, b) => b.LastUpdate - a.LastUpdate)
                                        .filter(parkingLot => parkingLot.ParkingLotId == item.Id)}
                return item
                })
            body = {RecreationArea: body[0].RecreationArea,
                    About: body[0].About,
                    Images: body[0].Images,
                    List : body
                    }
        }
        else if  (countyFilter !== null && countyFilter !== undefined && countyFilter === "all"){
            var counties = [];
            for(var i = 0; i<body.length;i++){
                counties.push(body[i].County)
            }
            body = {Counties :[...new Set(counties)]}
        }
        else if (countyFilter !== null && countyFilter !== undefined){
            body = body.filter(location => location.CountyURL == countyFilter);
            body = body.map(item => {
                item = {...item, ParkingData: 
                            parkingData
                            .sort((a, b) => b.LastUpdate - a.LastUpdate)
                            .filter(parkingLot => parkingLot.ParkingLotId == item.Id)}
                return item
            })
            console.log("body")
            console.log(JSON.stringify(body))
            console.log("body")
            console.log(JSON.stringify(body))
            var recAreas = [];
            for(var i = 0; i<body.length;i++){
                recAreas.push(body[i].RecreationArea)
            }
            let long = body[0].Longitude;
            let lat = body[0].Latitude;
            recAreas =  [...new Set(recAreas)];
            console.log(recAreas)
            let map = [];
            
            for (var i =0; i<recAreas.length;i++){
                map.push(new Map());
                map[i].set("RecreationArea", recAreas[i]);
                map[i].set("List", []);
                
                for(let j = 0; j<body.length; j++){
                    console.log(body.length)
                    console.log(j)
                    if(body!=[] && body[j].RecreationArea==recAreas[i]){
                        map[i].get("List").push(body.splice(j, 1)[0]);
                        j--;
                    }
                    console.log(body.length)
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
            countyFilter = countyFilter.substring(1);
            countyFilter = countyFilter.charAt(0).toUpperCase() + countyFilter.substring(1);
            body = { County : countyFilter,
                    Longitude: long,
                    Latitude: lat,
                    List : map};
                    
        }
        else{
            body = body.map(item => {
                item = {...item, ParkingData: 
                    parkingData
                    .sort((a, b) => b.LastUpdate - a.LastUpdate)
                    .filter(parkingLot => parkingLot.ParkingLotId == item.Id)
                }
                return item
            })

        }
        
        
        // body = body.map(item => {
        //     item = {...item, ParkingData: parkingData.filter(parkingLot => parkingLot.ParkingLotId == item.Id)}
        //     return item
        // })

    } catch (err) {
        statusCode = '400';
        body = err.message
    } finally {
        console.log(JSON.stringify(body))
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers,
    };
};