'use strict'

import qs from 'querystring'
import express from 'express'
import wga from 'wga'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import basicAuth from 'basic-auth'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import tz from 'moment-timezone'

import eventStore from './event-store'

let api_user = process.env.API_USER
if (!api_user) {
  throw new Error('must define api_user in environment')
}
let jwt_allowed_email = process.env.JWT_ALLOWED_EMAIL || 'default@pmev.com'
let jwt_secret = process.env.JWT_SECRET

let router = express.Router()

// parse body as json
router.use(bodyParser.json())
router.use(cookieParser())

// authentication
router.use((req, res, next) => {
  // check jwt in cookie first
  if (req.cookies.jwt) {
    try {
      let decoded = jwt.verify(req.cookies.jwt, jwt_secret)
      if (decoded.email !== jwt_allowed_email) {
        throw new Error('email in token: "' + decoded.email + '" is not allowed, please check the configuration')
      }
      return next()
    } catch(err) {
      return res.status(401).send('jwt verification failed: ' + err)
    }
  } else { // or check basic auth
    let user = basicAuth(req)
    if (!user || !user.name || user.name !== api_user) {
      // cannot set basicauth header, otherwise browser will popup dialog
      //res.set('WWW-Authenticate', 'Basic realm=Authorization Required')
      return res.sendStatus(401)
    }
    return next()
  }
})

router.get('/', wga(async (req, res) => {
  // pass through the query string to parse api
  // like: ?limit=20&skip=30
  let data = await eventStore.getEvents(qs.stringify(req.query))
  data.results.forEach(e => {
    let mmt = moment(e.createdAt)
    e.eventTime = mmt.tz('America/Los_Angeles').format('YYYYMMDD HH:mm:ss')
    e.day = mmt.tz('America/Los_Angeles').format('ddd')
  })
  res.json(data)
}))

router.post('/', wga(async (req, res) => {
  // event - host:string, message:string, msgType:string, other attributes
  let message = req.body
  if (!message.hasOwnProperty('host')) {
    res.status(400).send('must have host information')
    return
  }

  if (!message.hasOwnProperty('msgType')) {
    message.msgType = 'default'
  }

  let result = await eventStore.addEvent(message)
  res.json(result)
}))

export default router
