'use strict'

import express from 'express'
import qs from 'querystring'
import fetch from 'node-fetch'
import wga from 'wga'
import jwt from 'jsonwebtoken'

let google_client_id = process.env.GOOGLE_API_CLIENT_ID
let google_client_secret = process.env.GOOGLE_API_CLIENT_SECRET
let jwt_secret = process.env.JWT_SECRET

let router = express.Router()

router.get('/google/login', (req, res) => {
  let callback_uri = req.protocol + '://' + req.get('host') + req.baseUrl + '/google/callback'
  let query_params = {
    scope: 'email',
    redirect_uri: callback_uri,
    response_type: 'code',
    client_id: google_client_id
  }
  res.redirect('http://accounts.google.com/o/oauth2/auth?' + qs.stringify(query_params))
})

router.get('/google/callback', wga(async (req, res) => {
  // get the code and exchange for access token
  let code = req.query.code
  if (!code) {
    console.error('cannot get code from query, cannot continue authentication')
    return res.redirect('/')
  }

  let response = await fetch('https://www.googleapis.com/oauth2/v3/token', {
    method: 'POST',
    headers: {
      "Content-type": "application/x-www-form-urlencoded"
    },
    body: qs.stringify({
      code: code,
      client_id: google_client_id,
      client_secret: google_client_secret,
      redirect_uri: req.protocol + '://' + req.get('host') + req.baseUrl + '/google/callback',
      grant_type: "authorization_code"
    })
  })
  let tokenInfo = await response.json()

  // the tokenInfo should contains id_token, and email can be extract from it
  if (!tokenInfo || !tokenInfo.id_token) {
    console.error('cannot find id_token from google response: ' + tokenInfo)
  } else {
    // extract email from id_token, and issue jwt_token, field = email
    let decoded = jwt.decode(tokenInfo.id_token)
    // sign jwt and set cookie, api will check the email later, here just go ahead and issue token
    let token = jwt.sign({ email: decoded.email }, jwt_secret, { expiresInMinutes: 120 })
    console.log('issue jwt: ' + token)
    res.cookie('jwt', token, { expires: new Date(Date.now() + 7200000), httpOnly: true })
  }
  res.redirect('/')
}))

export default router
