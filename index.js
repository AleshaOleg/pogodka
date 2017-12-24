#! /usr/bin/env node

const geoip = require('geoip-lite')
const extIP = require('ext-ip')()
const request = require('request')

const apiKey = 'f2d5b989dfafdab237be56401ef53185'

const fahrenheitCountries = ['KY', 'BS', 'BZ', 'PW', 'US', 'PR', 'GU', 'UM']

extIP.get().then(ip => {
  const geo = geoip.lookup(ip)
  const isFahrenheitCountry = fahrenheitCountries.indexOf(geo.country) > -1
  const req = 'http://api.openweathermap.org/data/2.5/weather?'
  request(`${req}lat=${geo.ll[0]}&lon=${geo.ll[1]}&appid=${apiKey}&units=metric`,
    (err, res, body) => {
      if (!err) {
        const response = JSON.parse(body)
        const temp = isFahrenheitCountry ? (response.main.temp * (9 / 5)) + 32 : response.main.temp
        const tempRound = (Math.round(temp * 2) / 2).toFixed(1)
        const tempScale = isFahrenheitCountry ? '°F' : '°C'
        console.log(`Current weather in ${response.name}: ${tempRound}${tempScale}, ${response.weather[0].main}`)
      } else {
        console.log(`Can't get weather. Try again.\nMore: ${err}`)
      }
    })
}, err => {
  console.error(`Can't get your location.\nMore: ${err}`)
})
