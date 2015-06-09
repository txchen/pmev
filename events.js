'use strict'

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

router.use((req, res, next) => {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required')
    return res.sendStatus(401)
  }
  let user = basicAuth(req)
  if (!user || !user.name) {
    return unauthorized(res)
  }

  if (user.name === api_user) {
    return next()
  } else {
    return unauthorized(res)
  }
})

// parse body as json or urlencoded
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

// TODO: pagination support
router.get('/', wga(async (req, res) => {
  res.json(await eventStore.getEvents())
}))

router.post('/', wga(async (req, res) => {
  // event - host:string, message:string, msgType:string, other attributes
  let message = req.body
  if (!message.hasOwnProperty('host')) {
    res.status(400).send('must have host information');
  }

  if (!message.hasOwnProperty('msgType')) {
    message.msgType = 'default'
  }

  let result = await eventStore.addEvent(message)
  res.json(result)
}))

export default router
