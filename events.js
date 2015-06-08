'use strict'

import express from 'express'
import bodyParser from 'body-parser'
import passportHttp from 'passport-http'
import passport from 'passport'
import eventStore from './event-store'

let api_user = process.env.API_USER
let api_pass = process.env.API_PASS

if (!api_user || !api_pass) {
  throw new Error('must define api_user and api_pass in environment')
}

passport.use(new passportHttp.BasicStrategy(
  (user, pass, done) => {
    if (user === api_user && pass === api_pass) {
      return done(null, user)
    } else {
      return done(null, false)
    }
  }
))

let router = express.Router()

// parse json or urlencoded
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

// basic auth to protect api
router.use(passport.authenticate('basic', { session: false }))

// TODO: pagination support
router.get('/', (req, res) => {
    res.json(eventStore.getAllEvents())
  })

router.post('/', (req, res) => {
    // event - host:string, message:string, msgType:string, other attributes
    let message = req.body
    if (!message.hasOwnProperty('host')) {
      res.status(400).send('must have host information');
    }

    if (!message.hasOwnProperty('msgType')) {
      message.msgType = 'default'
    }

    eventStore.addEvent(message)
    res.json(message)
  })

export default router
