'use strict'

import qs from 'querystring'
import express from 'express'
import wga from 'wga'
import bodyParser from 'body-parser'
import basicAuth from 'basic-auth'
import eventStore from './event-store'

let api_user = process.env.API_USER
if (!api_user) {
  throw new Error('must define api_user in environment')
}

let router = express.Router()

// TODO: allow jwt as well
router.use((req, res, next) => {
  let user = basicAuth(req)
  if (!user || !user.name || user.name !== api_user) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required')
    return res.sendStatus(401)
  }
  return next()
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
