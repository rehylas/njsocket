
const njsocket = require('./core/njsocket');
const routes = require('./routers/route');
const works = require('./worker/index');

njsocket.Run()

//for test
setInterval( function(){
    njsocket.Pub("tick", {"lastprice": new Date(  ) })
}, 2000 )


setInterval( function(){
    njsocket.P2P("socketid","chat", {"dt": new Date(  ) })
}, 2000 )
