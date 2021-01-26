const RTC_CONFIG = {
    iceServers: [{ urls: ["stun:stun.l.google.com:19302", "stun:stun2.l.google.com:19302"] }]
};  

export function createConn() {
    let conn = {
        pc: new RTCPeerConnection(RTC_CONFIG),
        dc: null,
        onMessage: null,
    }
    conn.pc.ondatachannel = (e) => {
      conn.dc = e.channel;
      conn.dc.onopen = onOpen;
      conn.dc.onmessage = (e) => onMessage(conn, e);
    }
    conn.pc.oniceconnectionstatechange = e => console.log(conn.pc.iceConnectionState);
    return conn;
}

function onOpen() {
  console.log("opened chat!!");
}
function onMessage(conn, e) {
  console.log("received message!");
  let data = JSON.parse(e.data)
  console.log(data.message);
  if (conn.onMessage) {
    conn.onMessage(data);
  }
}

export function sendMessage(conn, message) {
  send(conn, {message: message});
}
export function send(conn, json) {
  conn.dc.send(JSON.stringify(json));
}

export function createOffer(conn, setOffer) {
  console.log("create offer");
  console.log(conn.pc.signalingState);
  conn.dc = conn.pc.createDataChannel("chat");

  conn.dc.onopen = onOpen;
  conn.dc.onmessage = (e) => onMessage(conn, e);

  conn.pc.createOffer()
    .then(d => conn.pc.setLocalDescription(d))
    .catch(console.log);

  conn.pc.onicecandidate = (e) => {
    if (e.candidate) return;
    setOffer(JSON.stringify(conn.pc.localDescription));
  }
}

export function join(conn, joinKey, setAnswer) {
  console.log("join");
  console.log(conn.pc.signalingState);
  let offerDesc = new RTCSessionDescription(JSON.parse(joinKey));

  conn.pc.setRemoteDescription(offerDesc)
    .then(() => conn.pc.createAnswer())
    .then(d => conn.pc.setLocalDescription(d))
    .catch(console.log);

  conn.pc.onicecandidate = (e) => {
    if (e.candidate) return;
    setAnswer(JSON.stringify(conn.pc.localDescription));
  }
}

export function acceptAnswer(conn, joinKey) {
  console.log("join");
  console.log(conn.pc.signalingState);
  var answerDesc = new RTCSessionDescription(JSON.parse(joinKey));
  conn.pc.setRemoteDescription(answerDesc).catch(console.log);
}