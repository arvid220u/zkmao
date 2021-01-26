import './App.css';
import React from 'react';
import { useRef, useEffect, useState } from 'react';
import * as p2p from "./p2p.js";

function Create1(props) {
  return (
    <div>
      <button onClick={() => p2p.createOffer(props.connRef.current, props.setMyOffer)}>Create game</button>
    </div>
  )
}

function Create2(props) {
  const [joinKey, setJoinKey] = useState("");
  return (
    <div>
      send this message to your friends: <code>{props.offer}</code><br/>
      input their answer:
      <input type="text" value={joinKey} onChange={(e) => setJoinKey(e.target.value)}></input>
      <button onClick={() => p2p.acceptAnswer(props.connRef.current, joinKey)}>Add player</button>
    </div>
  )
}

function Join1(props) {
  const [joinKey, setJoinKey] = useState("");
  return (
    <div>
      <input type="text" value={joinKey} onChange={(e) => setJoinKey(e.target.value)}></input>
      <button onClick={() => p2p.join(props.connRef.current, joinKey, props.setMyAnswer)}>Join</button>
    </div>
  )
}

function Join2(props) {
  return (
    <div>
      send this message to your friends: <code>{props.answer}</code><br/>
    </div>
  )
}

function Welcome(props) {
  console.log(props.connRef);
  return (
    <div>
      <Create1 connRef={props.connRef} setMyOffer={props.setMyOffer}/><br/>
      <Join1 connRef={props.connRef} setMyAnswer={props.setMyAnswer}/><br/>
    </div>
  )
}

function Lobby(props) {
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState("");

  function onSendMessage() {
    p2p.sendMessage(props.connRef.current, chatMessage);
    newMessage(chatMessage);
    setChatMessage("");
  }

  function newMessage(m) {
    setMessages(oldm => oldm + "\n" + m);
  }

  useEffect(() => {
    props.connRef.current.onMessage = (m) => newMessage(m.message);
    return () => {
      props.connRef.current.onMessage = null;
    }
  }, [props.connRef]);

  return (
    <div>
      {props.offer ? <Create2 connRef={props.connRef} offer={props.offer}/> : <Join2 connRef={props.connRef} answer={props.answer}/>}
      <hr/>
      Participants list: idk<br/>
      <hr/>
      <input type="text" value={chatMessage} onChange={(e) => setChatMessage(e.target.value)}></input>
      <button onClick={onSendMessage}>Send message</button>
      messages:
      <p style={{whiteSpace: "pre-line"}}>{messages}</p>
    </div>
  )
}

function Setup(props) {
  const [myOffer, setMyOffer] = useState(null);
  const [myAnswer, setMyAnswer] = useState(null);

  if (myOffer || myAnswer) {
    return <Lobby connRef={props.connRef} offer={myOffer} answer={myAnswer}/>;
  } else {
    return (
      <React.Fragment>
        <Welcome connRef={props.connRef} setMyOffer={setMyOffer} setMyAnswer={setMyAnswer}/>
      </React.Fragment>
    )
  }

}

function App() {
  const [inSetup, setInSetup] = useState(true);
  const connRef = useRef();

  useEffect(() => {
    connRef.current = p2p.createConn();
  }, []);

  return (
    <div className="App">
      {inSetup && <Setup connRef={connRef}/>}
      {!inSetup && "yay"}
    </div>
  );
}

export default App;
