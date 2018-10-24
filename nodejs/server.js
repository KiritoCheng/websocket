/**
 * Created by Kirito on 2017/7/10.
 */
var WebSocket=require('ws')
var WebSocketServer = WebSocket.Server,
    wss = new WebSocketServer({port: 8181});

var uuid = require('node-uuid');
var clients = [], clientIndex = 1;
//消息发送
function wsSend(type, client_uuid, nickname, message) {
    for (var i = 0; i < clients.length; i++) {
        var clientSocket = clients[i].ws;
        if (clientSocket.readyState === WebSocket.OPEN) {
            clientSocket.send(JSON.stringify({
                "type": type,
                "id": client_uuid,
                "nickname": nickname,
                "message": message
            }))
        }
    }
}

wss.on('connection', function (ws) {
    // console.log('服务端连接');
    //
    // ws.on('message', function (message) {
    //     console.log(message);
    //     ws.send(message);
    // });

    var client_uuid = uuid.v4();
    var nickname = "用户" + clientIndex;
    clientIndex += 1;
    clients.push({"id": client_uuid, "ws": ws, "nickname": nickname});
    console.log('client [%s] connected', client_uuid);
    var connect_msg = nickname + ' 加入房间';

    wsSend("notification", client_uuid, nickname, connect_msg);

    ws.on("message", function (msg) {
        if (msg.indexOf('/nick') === 0) {
            var nickname_array = msg.split(' ');
            if (nickname_array.length >= 2) {
                var old_nickname = nickname;
                nickname = nickname_array[1];
                var nickname_msg = old_nickname + '改变昵称' + nickname;
                wsSend("nick_update", client_uuid, nickname, nickname_msg);
            }
        } else {
            wsSend("message", client_uuid, nickname, msg)
        }
    });

    var closeSocket = function (customMessage) {
        for (var i = 0; i < clients.length; i++) {
            if (clients[i].id == client_uuid) {
                var disconnect_message;
                if(customMessage){
                    disconnect_message = customMessage;
                }else{
                    disconnect_message = nickname  + "退出连接"
                }
                wsSend("notification",client_uuid,nickname,disconnect_message);
                clients.splice(i, 1);
            }
        }
    };

    ws.on('close', function () {
        closeSocket();
    });
});

