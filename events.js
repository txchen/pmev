'use strict'

import qs from 'querystring'
import express from 'express'
import wga from 'wga'
import jwt from 'express-jwt'
import bodyParser from 'body-parser'
import basicAuth from 'basic-auth'
import eventStore from './event-store'

let api_user = process.env.API_USER
if (!api_user) {
  throw new Error('must define api_user in environment')
}
let jwt_allowed_email = process.env.JWT_ALLOWED_EMAIL || 'default@pmev.com'

let router = express.Router()

// parse authorization header as jwt first
router.use(jwt({ secret: 'mysecret' }))

router.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') { // if jwt is not available, check basic auth as fallback
    let user = basicAuth(req)
    if (!user || !user.name || user.name !== api_user) {
      res.set('WWW-Authenticate', 'Basic realm=Authorization Required')
      return res.sendStatus(401)
    }
    req.basicAuth = true
    return next()
  }
})

router.use((req, res, next) => {
  if (req.basicAuth || req.user.email === jwt_allowed_email) {
    return next()
  } else {
    return res.status(401).send('user in jwt not allowed')
  }
})

// parse body as json or urlencoded
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

router.get('/', wga(async (req, res) => {
  // pass through the query string to parse api
  // like: ?limit=20&skip=30
  res.json(await eventStore.getEvents(qs.stringify(req.query)))
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
