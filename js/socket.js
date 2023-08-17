import { socket_url } from "@/common/config.js";
//是否已经连接上ws
let isOpenSocket = false;
//心跳间隔，单位毫秒
let heartBeatDelay = 3000;
let heartBeatInterval = null;
//心跳时发送的消息文本
let heartBeatText = "heart";
//最大重连次数
let reconnectTimes = 10;
let count = 0;
let reconnectInterval = null;
//重连间隔，单位毫秒
let reconnectDelay = 3000;
let socketTask = null;

//这个参数是防止重连失败之后onClose方法会重复执行reconnect方法，导致重连定时器出问题
//连接并打开之后可重连，且只执行重连方法一次
let reconnectIng = false;
let self_token = "";

//封装的对象，最后以模块化向外暴露，
//init方法 初始化socketTask对象
//completeClose方法 完全将socketTask关闭（不重连）
//其他关于socketTask的方法与uniapp的socketTask api一致
let ws = {
  socketTask: null,
  init,
  send,
  completeClose,
};

function init(data) {
  self_token = data.data.token;
  uni.closeSocket(); // 确保创建前已关闭了Socket
  socketTask = uni.connectSocket({
    url: socket_url,
    complete: () => {},
  });
  socketTask.onOpen((res) => {
    isOpenSocket = true;
    send(data);
    clearInterval(heartBeatInterval);
    clearInterval(reconnectInterval);
    heartBeatInterval = null;
    reconnectInterval = null;

    console.log("ws连接成功");
    //开启心跳机制
    // heartBeat();
  });
  socketTask.onMessage((res) => {
    //自定义处理onMessage方法
    console.log("接收消息===", res);
  });
  socketTask.onError((err) => {
    console.log("错误--", err);
    reconnect();
  });
  socketTask.onClose((errMsg) => {
    console.log("断开原因--", errMsg);
    if (isOpenSocket) {
      console.log("ws与服务器断开");
    } else {
      console.log("连接失败");
    }
    isOpenSocket = false;
  });
  ws.socketTask = socketTask;
}

function heartBeat() {
  heartBeatInterval = setInterval(() => {
    let data = {
      type: heartBeatText,
      data: { token: self_token },
    };
    console.log("心跳==", data);
    send(data);
  }, heartBeatDelay);
}

function send(value) {
  ws.socketTask.send({
    data: JSON.stringify(value),
    async success() {
      console.log("消息发送成功");
    },
  });
}

function reconnect() {
  //如果不是人为关闭的话，进行重连
  if (isOpenSocket && !reconnectIng) {
    reconnectIng = true;
    reconnectInterval = setInterval(() => {
      console.log("正在尝试重连");
      //重连一定次数后就不再重连
      if (count >= reconnectTimes) {
        clearInterval(reconnectInterval);
        reconnectInterval = null;
        reconnectIng = false;
        console.log("网络异常或服务器错误");
        return;
      }
      const data = {
        type: "auth",
        data: { token: self_token },
      };
      init(data);
      count++;
      console.log(count, "count");
    }, reconnectDelay);
  }
}
function completeClose() {
  //先将心跳与重连的定时器清除
  clearInterval(heartBeatInterval);
  clearInterval(reconnectInterval);
  heartBeatInterval = null;
  reconnectInterval = null;
  ws.socketTask.close();
}

module.exports = ws;
