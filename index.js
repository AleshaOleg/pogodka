#! /usr/bin/env node

const geoip = require('geoip-lite')
const extIP = require('ext-ip')()
const request = require('request')

const apiKey = 'f2d5b989dfafdab237be56401ef53185'

extIP.get().then(ip => {
  const geo = geoip.lookup(ip)
  const req = 'http://api.openweathermap.org/data/2.5/weather?'
  request(`${req}lat=${geo.ll[0]}&lon=${geo.ll[1]}&appid=${apiKey}&units=metric`,
    (err, res, body) => {
      if (!err) {
        const response = JSON.parse(body)
        console.log(`Current temperature in ${response.name}: ${response.main.temp}`)
      } else {
        console.log(`Can't get weather. Try again.\nMore: ${err}`)
      }
    })
}, err => {
  console.error(`Can't get your location.\nMore: ${err}`)
})
