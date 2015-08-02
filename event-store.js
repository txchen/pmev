import fetch from 'node-fetch'

const eventClass = 'pEvent'
const parseUrl = 'https://api.parse.com/1/classes/' + eventClass

const parseAppid = process.env.PARSE_APPID
const parseRestkey = process.env.PARSE_RESTKEY

const parseHeaders = {
  'X-Parse-Application-Id': parseAppid,
  'X-Parse-REST-API-Key': parseRestkey,
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  }
  throw new Error(`status $(response.status), database error: $(response.statusText)`)
}

export default {
  async getEvents(querystring) {
    let url = parseUrl
    if (querystring) {
      url += '?' + querystring
    }
    const response = await fetch(url, {
      headers: parseHeaders,
    })
    checkStatus(response)
    return await response.json()
  },

  async addEvent(eventData) {
    const response = await fetch(parseUrl, {
      method: 'POST',
      headers: parseHeaders,
      body: JSON.stringify(eventData),
    })
    checkStatus(response)
    return await response.json()
  },
}
