/**
 * Created by Kirito on 2017/7/10.
 */
var ws = new WebSocket("ws://localhost:8181");
var nickname = "";
ws.onopen = function (e) {
    console.log('开始连接');
};
// function senMessage() {
//     var msg = document.getElementById('inputVal').value
//     ws.send(msg)
//     ws.onmessage=function (e) {
//         console.log('接收消息:',e.data,e);
//     }
// }

function appendLog(type, nickname, msg) {
    if (typeof msg == "undefined") return;
    var msgs = document.getElementById('msgs');
    var msgElem = document.createElement('p');
    var prefaace_label;
    if (type === 'notification') {
        prefaace_label = "<span>*</span>"
    } else if (type == 'nick_update') {
        prefaace_label = "<span>*</span>"
    } else {
        prefaace_label = "<span>" + nickname + "</span>"
    }

    var msg_text = "<h2>" + prefaace_label + "：&nbsp;&nbsp;" + msg + "</h2>";
    msgElem.innerHTML = msg_text;
    msgs.appendChild(msgElem);
}

ws.onmessage = function (e) {
    console.log(e.data);
    var data = JSON.parse(e.data);
    nickname = data.nickname;
    appendLog(data.type, data.nickname, data.message);
    console.log("ID: [%s] = %s", data.id, data.message);
};

ws.onclose = function (e) {
    appendLog("Connection closed");
    console.log('连接关闭')
};

function sendMessage() {
    var messageField = document.getElementById('inputVal');
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(messageField.value);
    }
    messageField.value = '';
    messageField.focus();
}

function changeName() {
    var name = document.getElementById('name').value;
    if(ws.readyState === WebSocket.OPEN){
        ws.send("/nick "+ name)
    }
}

