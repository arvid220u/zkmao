const RTC_CONFIG = {
  iceServers: [
    { urls: ["stun:stun.l.google.com:19302", "stun:stun2.l.google.com:19302"] },
  ],
};

// var haveGum = navigator.mediaDevices
//   .getUserMedia({ video: true, audio: true })
//   .catch(console.log);

export function createConn() {
  let conn = {
    pc: new RTCPeerConnection(RTC_CONFIG),
    dc: null,
    messageHandlers: {},
    messageHandlersIndx: "0",
  };
  conn.pc.ondatachannel = (e) => {
    conn.dc = e.channel;
    conn.dc.onopen = () => onOpen(conn);
    conn.dc.onmessage = (e) => onMessage(conn, e);
  };
  conn.pc.oniceconnectionstatechange = (e) =>
    console.log(conn.pc.iceConnectionState);
  return conn;
}

function onOpen(conn) {
  console.log("opened chat!!");
  console.log(conn.messageHandlers);
  const data = { type: "info", value: "successfully opened connection!!" };
  for (const indx in conn.messageHandlers) {
    conn.messageHandlers[indx](data);
  }
}
function onMessage(conn, e) {
  console.log("received message!");
  console.log(conn.messageHandlers);
  let data = JSON.parse(e.data);
  console.log(data);
  for (const indx in conn.messageHandlers) {
    conn.messageHandlers[indx](data);
  }
}
export function addMessageHandler(conn, handler) {
  const indx = conn.messageHandlersIndx;
  conn.messageHandlers[indx] = handler;
  conn.messageHandlersIndx = `${parseInt(indx) + 1}`;
  return indx;
}
export function removeMessageHandler(conn, key) {
  console.log(`removing key ${key} from conn ${conn}`);
  delete conn.messageHandlers[key];
}

export function sendMessage(conn, message) {
  send(conn, { type: "message", message: message });
}
export function sendData(conn, data) {
  send(conn, { type: "data", ...data });
}
export function send(conn, json) {
  conn.dc.send(JSON.stringify(json));
}

export function createOffer(conn, setOffer) {
  console.log("create offer");
  console.log(conn.pc.signalingState);
  conn.dc = conn.pc.createDataChannel("chat");

  conn.dc.onopen = () => onOpen(conn);
  conn.dc.onmessage = (e) => onMessage(conn, e);

  // haveGum
  //   .then(() => conn.pc.createOffer())
  conn.pc
    .createOffer()
    .then((d) => conn.pc.setLocalDescription(d))
    .catch(console.log);

  conn.pc.onicecandidate = (e) => {
    if (e.candidate) return;
    setOffer(encodeKey(JSON.stringify(conn.pc.localDescription)));
  };
}

function encodeKey(json) {
  return btoa(json).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function decodeKey(key) {
  let str = key;
  if (str.length % 4 !== 0) {
    str += "===".slice(0, 4 - (str.length % 4));
  }
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  return atob(str);
}

export function join(conn, joinKey, setAnswer) {
  console.log("join");
  console.log(conn.pc.signalingState);
  let offerDesc = new RTCSessionDescription(JSON.parse(decodeKey(joinKey)));

  conn.pc
    .setRemoteDescription(offerDesc)
    .then(() => conn.pc.createAnswer())
    .then((d) => conn.pc.setLocalDescription(d))
    .catch(console.log);

  conn.pc.onicecandidate = (e) => {
    if (e.candidate) return;
    setAnswer(encodeKey(JSON.stringify(conn.pc.localDescription)));
  };
}

export function acceptAnswer(conn, joinKey) {
  console.log("join");
  console.log(conn.pc.signalingState);
  var answerDesc = new RTCSessionDescription(JSON.parse(decodeKey(joinKey)));
  conn.pc.setRemoteDescription(answerDesc).catch(console.log);
}

export function numConnections(conn) {
  // TODO: update this for many players
  return 1;
}
