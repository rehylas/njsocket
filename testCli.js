var io = require('socket.io-client');


let socket;
const host = 'ws://localhost:8090/market'
// const host = 'ws://test.socket.hubdex.io:8090/coinxpMarket'

/**
 * 
 * @param {Object} userInfo {userNameChain}
 * @param {*} cb 回调函数 (err, type: 返回数据类型, data: 返回的数据)
 */
function connectLogin(userInfo, cb) {
    if (socket && socket.connected) {
        if (userInfo && userInfo.userNameChain) {
            socket.emit('login', JSON.stringify(userInfo));
        }
    } else {
        socket = io(host);
        console.log('socket create')
        socket.on('connect', function () {
            console.log('connect')
            setTimeout(function () {
                socket.emit('login', JSON.stringify(userInfo));
                console.log("login over ")
            }, 1000)

        });
    }

    socket.on('login', data => cb('login', JSON.stringify(data)));
    socket.on('tick', data => cb('tick', JSON.stringify(data)));
    socket.on('chat', data => cb('chat', JSON.stringify(data)));
    socket.on('heatbeat', data => cb('heatbeat', JSON.stringify(data)));
    
    socket.on('disconnect', function () {
        console.log('websocket disconnect .... ');
    });
}  

function LoginoutSocket(userdata) {
    if (socket && socket.connected) {
        socket.emit('loginout', JSON.stringify(userdata));
    }
}

function Sub(title){
    if (socket && socket.connected) {
        socket.emit('sub', JSON.stringify( {"title":title}  ));
    }    
}

function Unsub(title){
    if (socket && socket.connected) {
        socket.emit('sub', JSON.stringify( {"title":title} ));
    }    
}

function closeSocket() {
    if (socket) {
        socket.close();
        socket = null;
    }
}


//////////////////////////////////////////////////////////////////////
//启动测试


let userInfo = { "username": "xxxx" }
connectLogin(userInfo, function (err, data) {
    console.log(data);
});

setTimeout(function () {
    Sub("sh600001")
    Sub("tick")
}, 1500)



