const njsocket = require('../core/njsocket');

const handle_login = function (client, data) {
    console.log(client.id + "  ", data)
    client.emit('login', 'ack login ' + JSON.stringify(data))
}


const handle_getSystemInfo = function (client, data) {
    console.log(client.id + "  ", data)
    client.emit('SystemInfo', 'ack login ' + JSON.stringify(data))
}

njsocket.Router("login", handle_login)
njsocket.Router("getSystemInfo", handle_getSystemInfo)

