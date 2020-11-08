const request = require('request');
/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function(callback) {
  request('https://api.ipify.org?format=json', (error, response, body) => {
    if (error) return callback(error, null);
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const parsedIP = JSON.parse(body);
    callback(null, parsedIP.ip);
    return;
  });
};

const fetchCoordsByIP = function(ip, callback) {
  request(`http://ip-api.com/json/${ip}`, (error, response, body) => {
    if (error) return callback(error, null, null);
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates for IP. Response: ${body}`;
      callback(Error(msg), null, null);
      return;
    }
    //could not convert latitude and longitude to objectss because of the API used
    const parsedLON = JSON.parse(body).lon;
    const parsedLAT = JSON.parse(body).lat;
    callback(null, parsedLAT, parsedLON);
    return;
  });
};

 /**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function(coords, callback) {
  // console.log(coords, typeof coords)
  request(`http://api.open-notify.org/iss-pass.json?lat=${coords.lat}&lon=${coords.lon}`, (error, response, body) => {
    if (error) return callback(error, null);
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates for IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const parsedCoords = JSON.parse(body).response;
    callback(null, parsedCoords);
    return;
  });
};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results. 
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */ 
const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) return callback(error, null);
    
    fetchCoordsByIP(ip, (error) => {
      if (error) return callback(error, null);
        
      fetchISSFlyOverTimes({lat: '48.4983', lon: '-123.4005'}, (error, nextPasses) => {
        if (error) return callback(error, null);
          
        callback(null, nextPasses);
      });
    });
  });
}

module.exports = { nextISSTimesForMyLocation };

//callback(null, fetchISSFlyOverTimes(fetchISSFlyOverTimes({lat: '48.4983', lon: '-123.4005'})))
