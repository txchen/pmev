import express from 'express'
import qs from 'querystring'
import fetch from 'node-fetch'
import awrap from 'awrap'
import jwt from 'jsonwebtoken'

const googleClientId = process.env.GOOGLE_API_CLIENT_ID
const googleClientSecret = process.env.GOOGLE_API_CLIENT_SECRET
const jwtSecret = process.env.JWT_SECRET

const router = new express.Router()

router.get('/google/login', (req, res) => {
  const callbackUri = req.protocol + '://' + req.get('host') + req.baseUrl + '/google/callback'
  const queryParams = {
    scope: 'email',
    redirect_uri: callbackUri,
    response_type: 'code',
    client_id: googleClientId,
  }
  res.redirect('http://accounts.google.com/o/oauth2/auth?' + qs.stringify(queryParams))
})

router.get('/google/callback', awrap(async (req, res) => {
  // get the code and exchange for access token
  const code = req.query.code
  if (!code) {
    console.error('cannot get code from query, cannot continue authentication')
    return res.redirect('/')
  }

  const response = await fetch('https://www.googleapis.com/oauth2/v3/token', {
    method: 'POST',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded',
    },
    body: qs.stringify({
      code: code,
      client_id: googleClientId,
      client_secret: googleClientSecret,
      redirect_uri: req.protocol + '://' + req.get('host') + req.baseUrl + '/google/callback',
      grant_type: 'authorization_code',
    }),
  })
  const tokenInfo = await response.json()

  // the tokenInfo should contains id_token, and email can be extract from it
  if (!tokenInfo || !tokenInfo.id_token) {
    console.error('cannot find id_token from google response: ' + tokenInfo)
  } else {
    // extract email from id_token, and issue jwt_token, field = email
    const decoded = jwt.decode(tokenInfo.id_token)
    // sign jwt and set cookie, api will check the email later, here just go ahead and issue token
    const token = jwt.sign({ email: decoded.email }, jwtSecret, { expiresInMinutes: 120 })
    console.log('issue jwt: ' + token)
    res.cookie('jwt', token, { expires: new Date(Date.now() + 7200000), httpOnly: true })
  }
  res.redirect('/')
}))

export default router
