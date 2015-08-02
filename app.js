import express from 'express'
import logger from 'morgan'

import events from './events'
import googleauth from './googleauth'

const app = express()
app.set('trust proxy', true) // set trust proxy, otherwise req.protocol is not precise
app.use(logger('dev'))

// Azure doesn't support X-Forwarded-Proto so we add it manually
app.use((req, res, next) => {
  if (req.headers['x-arr-ssl'] && !req.headers['x-forwarded-proto']) {
    req.headers['x-forwarded-proto'] = 'https'
  }
  return next()
})

app.use('/', express.static('static'))
app.use('/auth', googleauth)
app.use('/events', events)

/* eslint no-unused-vars: 0 */
// error handling, should be after normal middleware
app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send(err.statusText)
  } else {
    console.error(err.stack)
    res.status(500).send('Internal Error')
  }
})

export default app
