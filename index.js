// entry point, do not use babel syntax here in this file, so that 'node' can launch this.
require("babel/register")

// ES5 code here
var server = require('./app')

server.set('port', (process.env.PORT || 17000));

var port = server.get('port')
server.listen(port, function () {
  console.log('PMEV listening on http://localhost:' + port)
})
