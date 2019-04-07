const path= require('path')
const express = require('express')
const weather = require('./weather.js')

const app = express()

//heroku
const port = process.env.PORT || 3000



app.get('/clima', function(req,res){
  res.setHeader('Acces-Control-Allow-Origin','*')
  if(!req.query.search){
    return res.send({
      error: 'Tienes que dar una ciudad a buscar'
    })
  }
  weather.ciudad(req.query.search, function(error, response){
    if(error){
      return res.send({
        error: error
      })
    }
    const ciudad = response
    
    weather.tiempo(response.lat, response.long, function(error,response){
      if(error){
        return res.send({
          error: error
        })
      }

      const respuesta = `${response.dia}. Actualmente está a ${response.clima}°C. Hay ${response.precipitacion}% de probabilidad de lluvia.`
      return res.send({
            ubicacion: ciudad.name,
            clima: respuesta
        })      
      })
    })
  })

app.listen(port, function(){
  console.log('up and running')


})

