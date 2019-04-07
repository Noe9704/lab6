const credentials = require('./credentials.js')
const request = require('request')

const tiempo = function( latitud, longitud, callback ) {
  const url = 'https://api.darksky.net/forecast/' +
  credentials.DARK_SKY_SECRET_KEY + `/${latitud},${longitud}?units=si&lang=es`

  request({ url: url, json: true }, function(error, response) {
    //detectar error en linea
  if(error){
      callback('Service unavailable',undefined);
    }  
    //error en datos
    else if (response.body.error != undefined) {
      callback(response.body.error, undefined);
     
    }  
    //paso las pruebas
    else if(response.body.latitude != undefined){
    const data = response.body.currently
    const info = {
      dia: data.summary,
      clima: data.temperature,
      precipitacion: data.precipProbability
    }        
        callback(undefined, info)

      }
      //error en la apikey
      else {
        callback('Key incorrecta', undefined);
        
      }
    });
}

const ciudad = function( nombre, callback ) {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${nombre}.json?access_token=` +
  credentials.MAPBOX_TOKEN

  request({ url: url, json: true }, function(error, response) {
    //error en linea
    if(error) {
      callback('Service unavailable.', undefined)
    } 
    //error en key
      else if(response.body.error != undefined) {
        callback('Key incorrecta', undefined)
    } 
    //error en ciudad
      else if(response.statusCode == 404) { 
        callback('Ciudad no valida', undefined)
    } 
    //paso datos
      else {
      const data = response.body.features[0]
      const info = {
        name: data.place_name,
        lat: data.center[1],
        long: data.center[0]
      }
      callback(undefined, info)
    }
  })
}

module.exports = {
  tiempo: tiempo,
  ciudad: ciudad
}