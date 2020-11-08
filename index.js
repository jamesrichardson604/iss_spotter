const { nextISSTimesForMyLocation } = require('./iss');

// fetchMyIP((error, ip) => {
//   if (error) {
//     console.log("It didn't work!" , error);
//     return;
//   }

//   console.log('It worked! Returned IP:' , ip);
// });

// fetchCoordsByIP('24.68.248.194', (error, latitude, longitude) => {
//   if (error) {
//     console.log("It didn't work!" , error);
//     return;
//   }

//   console.log('It worked! Returned Coords: ', 'latitude: ', latitude, 'longitude: ', longitude);
// });

// fetchISSFlyOverTimes({lat: '48.4983', lon: '-123.4005'}, (error, passTimes) => {
//   if (error) {
//     console.log("It didn't work!" , error);
//     return;
//   }
    
//   console.log('It worked! Returned Coords: ', passTimes);

// });

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  for(let x of passTimes){
    console.log(`Next pass at risetime: ${x.risetime} for ${x.duration} seconds`);
  }
});
