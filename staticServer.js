// report event api
'use strict'

// import utils from './utils'
import express from 'express'
import passport from 'passport'
import github from 'passport-github2'
import session from 'express-session'

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Use the GitHubStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and GitHub
//   profile), and invoke a callback with a user object.
passport.use(new github.Strategy({
    clientID: '86f4cafd2d73be409749',
    clientSecret: 'fbea3edeee8ff29cb1d4c567403e76d26de7f564',
    callbackURL: "http://localhost:18000/auth/github/callback"
  },
  (accessToken, refreshToken, profile, done) => {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      // To keep the example simple, the user's GitHub profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the GitHub account with a user record in your database,
      // and return that user instead.
      console.log(profile)
      return done(null, profile)
    })
  }
))

let router = express.Router()

router.use(session({ resave: true, saveUninitialized: false, secret: 'keyboard cat' }));
router.use(passport.initialize())
router.use(passport.session())

router.get('/login', (req, res) => {
  res.send('loginPage')
})


// GET /auth/github
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in GitHub authentication will involve redirecting
//   the user to github.com.  After authorization, GitHubwill redirect the user
//   back to this application at /auth/github/callback
router.get('/auth/github',
  passport.authenticate('github', { session: false, scope: [ 'user:email' ] }),
  (req, res) => {
    // The request will be redirected to GitHub for authentication, so this
    // function will not be called.
  })

// GET /auth/github/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: 'login' }),
  (req, res) => {
    console.log('login success')
    res.redirect('/')
  })

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('');
  })

// protect the static site with github auth
router.use((req, res, next) => {
    if (!req.isAuthenticated()) {
      res.redirect('login')
    } else {
      next()
    }
  },
  express.static('static')
)

export default router
