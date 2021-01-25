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

export function createOffer(conn, setOffer) {
  console.log("create offer");
  conn.dc = conn.pc.createDataChannel('test', {reliable: true})

  conn.dc.onopen = () => { 
    console.log("opened chat!!!");
  }
  conn.dc.onmessage = (e) => {
    console.log("received message!");
    let data = JSON.parse(e.data)
    console.log(data.message);
  }

  conn.pc.onicecandidate = function (e) {
    if (e.candidate == null) {
      setOffer(JSON.stringify(conn.pc.localDescription));
    }
  }

  conn.pc.createOffer((desc) => {
    conn.pc.setLocalDescription(desc, function() {}, function() {})
  }, () => {}, SDP_CONSTRAINTS)
}