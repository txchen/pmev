// entry point, do not use babel syntax here in this file, so that 'node' can launch this.
require("babel/register")

// ES5 code here
var server = require('./app')

server.listen(18000, function () {
  console.log('Express server listening http://localhost:18000')
})
