'use strict'

import fetch from 'node-fetch'

const eventClass = 'pEvent'
let parse_url = 'https://api.parse.com/1/classes/' + eventClass

let parse_appid = process.env.PARSE_APPID
let parse_restkey = process.env.PARSE_RESTKEY

let parse_headers = {
  'X-Parse-Application-Id': parse_appid,
  'X-Parse-REST-API-Key': parse_restkey
}

export default {
  async getEvents(limit = 200) {
    var response = await fetch(parse_url, {
      headers: parse_headers
    })
    return await response.json()
  },

  async addEvent(eventData) {
    var response = await fetch(parse_url, {
      method: 'POST',
      headers: parse_headers,
      body: JSON.stringify(eventData)
    })
    return await response.json()
  }
}
