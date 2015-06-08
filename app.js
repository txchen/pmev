import express from 'express'
import logger from 'morgan'
import wga from 'wga'
import events from './events'
//import staticServer from './staticServer'

let app = express()
app.use(logger('dev'))

//app.use('/static', staticServer)

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

export default app
