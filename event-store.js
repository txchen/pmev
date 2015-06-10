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

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  }
  throw { status: response.status, statusText: 'database error: ' + response.statusText }
}

export default {
  async getEvents(querystring) {
    let url = parse_url
    if (querystring) {
      url += '?' + querystring
    }
    let response = await fetch(url, {
      headers: parse_headers
    })
    checkStatus(response)
    return await response.json()
  },

  async addEvent(eventData) {
    let response = await fetch(parse_url, {
      method: 'POST',
      headers: parse_headers,
      body: JSON.stringify(eventData)
    })
    checkStatus(response)
    return await response.json()
  }
}
