'use strict'

import express from 'express'
import logger from 'morgan'
import wga from 'wga'

import events from './events'
import googleauth from './googleauth'

let app = express()
app.use(logger('dev'))

app.use('/', express.static('static'))
app.use('/auth', googleauth)
app.use('/events', events)

// error handling, should be after normal middleware
app.use(function(err, req, res, next) {
  if (err.status) {
    res.status(err.status).send(err.statusText)
  } else {
    console.error(err.stack)
    res.status(500).send('Internal Error')
  }
})

export default app
