const cfg = require('../conf/config.json');
const loglevel = require('loglevel');
let loger = loglevel.getLogger("njsocekt");

//log.getLogger("module-two").setLevel("TRACE");



const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.options('*', cors());

const server = require('http').createServer(app);
const io = require('socket.io')(server);
const PORT = process.env.SOCKET_SERVER_PORT || cfg.port;
let adminNamespace;//= io.of( cfg.wspath );

const HEATBEAT_TIME = 20000  //心跳间隔 ms

////////////////////////////////////////////
//对外函数
////////////////////////////////////////////

//第一需求：处理的映射关系
let Routers = new Map();
let EventHandlers = { "connection": null, "disconnect": null }

//第二需求: 处理组播
// 利用 socket.io 的组播

//第三需求: p2p



//启动
const Run = async () => {
    LogInfo("njsocket run()");
    //socket 配置
    adminNamespace = io.of(cfg.wspath).on('connection', (client) => {

        if (EventHandlers['connection']) {
            EventHandlers['connection'](client)
        } else {
            loger.info('connection .... ', client.id);
        }
        LogInfo("connection online  is ", Object.keys(io.sockets.sockets).length)

        client.on("disconnect", function () {
            if (EventHandlers['disconnect']) {
                EventHandlers['disconnect'](client)
            } else {
                loger.info('disconnect .... ', client.id);
            }
            //清空 组播里的用户数据    
            client.leaveAll()
            // removeClientFromMap( client )

        });

        //路由
        Routers.forEach(function (value, key) {
            client.on(key, (data) => {
                value(client, data);
            });
        });

        //固定路由
        client.on("sub", (data) => {
            handler_sub(client, data);
        });
        client.on("unsub", (data) => {
            handler_unsub(client, data);
        });
        client.on("heatbeat", (data) => {
            handler_heatbeat(client, data);
        });

    })

    // 启动服务
    server.listen(PORT);
    LogInfo('启动服务..., 端口:' + PORT);

    //客户保活心跳
    setInterval(function () {
        adminNamespace.emit("heatbeat", { "beat": new Date() })
    }, HEATBEAT_TIME)

}

//添加路由
const Router = async (message, msgHandler) => {
    Routers.set(message, msgHandler)
}

//添加事件处理 event = connection / disconnect
const AddEvent = async (event, handler) => {
    EventHandlers[event] = handler
}

//组播
const Pub = async (title, data) => {
    adminNamespace.to(title).emit(title, data)
}

//组播
const P2P = async (socketid, title, data) => {
    // for ( key in io.sockets.sockets ){
    //     // io.sockets.sockets[socketid].emit(title, data) 
    //     console.log( "client:",key )
    //     // io.sockets.sockets[key].emit(title, data) 
    //     io.sockets.sockets[key].client.emit('heatbeat', {"xxx":"aaa"}  ) 
    // }

    // if (io.sockets.sockets.has(socketid)) {
    //     io.sockets.sockets[socketid].emit(title, data)
    // }
    
}

//日志相关
const LogDebug = (...vars) => {
    loger.debug(...vars);
}

const LogInfo = (...vars) => {
    loger.info(...vars);
}

const LogWarn = (...vars) => {
    loger.warn(...vars);
}

const LogError = (...vars) => {
    loger.error(...vars);
}

////////////////////////////////////////////
//内部函数
const handler_sub = function (client, data) {
    let subData = JSON.parse(data)
    if (!subData || !subData.title) {
        return
    }
    client.join(subData.title)

};

const handler_unsub = function (client, data) {
    let subData = JSON.parse(data)
    if (!subData || !subData.title) {
        return
    }

    client.leave(subData.title)

};

const handler_heatbeat = function (client, data) {
    client.emit("heatbeatack", data)
}

const removeClientFromMap = function (client) {

}

const sendHeatbeat = function (client) {
    LogDebug("emit heatbeat")
    client.emit("heatbeat", "beat")
}




////////////////////////////////////////////
//初始化
const init = function () {

    loger.info("njsocket init()");
    loger.setLevel(cfg.loglevel.toUpperCase());

    app.get('/ping', function (req, res) {
        return res.end('pong');
    });
}

init()

////////////////////////////////////////////
//输出
////////////////////////////////////////////

module.exports.cfg = cfg;
module.exports.Run = Run;
module.exports.Router = Router;
module.exports.AddEvent = AddEvent;
module.exports.Pub = Pub;
module.exports.P2P = P2P
module.exports.LogDebug = LogDebug;
module.exports.LogInfo = LogInfo;
module.exports.LogWarn = LogWarn;
module.exports.LogError = LogError;










