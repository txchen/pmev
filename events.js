'use strict'

import express from 'express'
import bodyParser from 'body-parser'
import passportHttp from 'passport-http'
import passport from 'passport'
import eventStore from './event-store'

passport.use(new passportHttp.BasicStrategy(
  (user, pass, done) => {
    // TODO: use config
    if (user === 'abc' && pass === 'cde') {
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
    // event - id:timestamp(server generate), host:string, message:string, msgType:string, other attributes
    let message = req.body
    if (!message.hasOwnProperty('host')) {
      res.status(400).send('must have host information');
    }

    if (!message.hasOwnProperty('msgType')) {
      message.msgType = 'default'
    }
    message.id = (new Date).getTime()

    eventStore.addEvent(message)
    res.json(message)
  })

export default router
