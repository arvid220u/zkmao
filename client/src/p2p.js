const RTC_CONFIG = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
};  
var SDP_CONSTRAINTS = {
    optional: [],
}

export function createConn() {
    let conn = {
        pc: new RTCPeerConnection(RTC_CONFIG),
        dc: null
    }
    return conn;
}

function onOpen() {
  console.log("opened chat!!");
}
function onMessage(e) {
  console.log("received message!");
  let data = JSON.parse(e.data)
  console.log(data.message);
}

export function createOffer(conn, setOffer) {
  console.log("create offer");
  conn.dc = conn.pc.createDataChannel('test', {reliable: true})

  conn.dc.onopen = onOpen;
  conn.dc.onmessage = onMessage;

  conn.pc.onicecandidate = function (e) {
    if (e.candidate == null) {
      setOffer(JSON.stringify(conn.pc.localDescription));
    }
  }

  conn.pc.createOffer((desc) => {
    conn.pc.setLocalDescription(desc, function() {}, function() {})
  }, () => {}, SDP_CONSTRAINTS)
}

export function join(conn, joinKey, setAnswer) {
  var offerDesc = new RTCSessionDescription(JSON.parse(joinKey))

  conn.pc.ondatachannel = function (e) {
    conn.dc = e.channel || e;
    conn.dc.onopen = onOpen;
    conn.dc.onmessage = onMessage;
  }
  
  conn.pc.onicecandidate = function (e) {
    if (e.candidate == null) {
      setAnswer(JSON.stringify(conn.pc.localDescription));
    }
  }

  conn.pc.setRemoteDescription(offerDesc)

  conn.pc.createAnswer((answerDesc) => {
    conn.pc.setLocalDescription(answerDesc)
  }, () => {}, SDP_CONSTRAINTS)
}