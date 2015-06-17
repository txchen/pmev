# PMEV - Poor man's event viewer

Design for collecting some random personal events, like the ones from NAS.

This is a nodejs app that takes events and shows in html. It uses Parse as the storage layer and it can be hosted on heroku.

### How to use

https://floating-cove-6028.herokuapp.com

To post new event, use basic auth and http POST:
```
http POST https://floating-cove-6028.herokuapp.com/events \
  host=myhost message=testing -a API_USER:
```

To view the events, browse the web site and login as google account.

### How to deploy

Firstly, create a google api account, enable google+ and contact API in the console. Create an project, set the callback url and get the API client and API secret.

Then, create a Parse.com account, create a project, get the ParseAPPID and REST API KEY.

Finally, create a heroku account, download heroku toolbet. In heroku dashboard, set the variables. And trigger the deployment:

```
git push heroku master
```

Follow `.envSample` to config the variables in heroku

### How to develop

First of all, create an `.env` file with the correct configurations. `.envSample` will show you what should be configured.

The app contains an API backend and a static frontend, to make everything auto reload after changes, run:

```
npm run dev
```

It would launch a webpack-dev-server, listening on http://localhost:18000 and proxy all the not found request to http://localhost:17000. Backend nodejs server will listen on http://localhost:17000. Open http://localhost:18000 in browser and start developing.

Webpack would not write the generated files during dev mode, so after code changes, run:

```
npm run dist
```

It would generated the final bundle javascripts.
