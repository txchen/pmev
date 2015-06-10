import express from 'express'
import logger from 'morgan'
import wga from 'wga'
import events from './events'
//import staticServer from './staticServer'

let app = express()
app.use(logger('dev'))


app.use('/', express.static('static'))

// app.use('/api', (req, res) => {
//   res.send('api')
// })

app.use('/events', events)

// // async handler, wrap with wga
// app.get('/', wga(async (req, res) => {
//   res.send(`Hello World: ${utils.magic()} and ${await utils.fooTask()}`)
// }))
//
// // mount userapi on /users
// app.use('/users', users);

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
