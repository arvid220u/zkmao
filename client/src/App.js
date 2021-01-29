import "./App.css";
import React from "react";
import { useCallback, useRef, useEffect, useState } from "react";
import * as p2p from "./p2p.js";
import * as logic from "./logic.js";

import { Game } from "./Game.js";
import { Chat } from "./Chat.js";

function Create1(props) {
  return (
    <div>
      <button
        onClick={() => p2p.createOffer(props.connRef.current, props.setMyOffer)}
      >
        create game
      </button>
    </div>
  );
}

function Create2(props) {
  const [joinKey, setJoinKey] = useState("");

  const onAddPlayer = useCallback(() => {
    p2p.acceptAnswer(props.connRef.current, joinKey);
  }, [props.connRef, joinKey]);

  return (
    <div>
      1. send this key to your friend: <code>{props.offer}</code>
      <hr />
      2. input their key:{" "}
      <input
        type="text"
        value={joinKey}
        onChange={(e) => setJoinKey(e.target.value)}
        onKeyUp={(e) => (e.key === "Enter" ? onAddPlayer() : 0)}
        placeholder="(paste key here)"
      ></input>
      <button onClick={onAddPlayer}>connect</button>
    </div>
  );
}

function Join1(props) {
  const [joinKey, setJoinKey] = useState("");

  const onJoin = useCallback(() => {
    p2p.join(props.connRef.current, joinKey, props.setMyAnswer);
  }, [props.connRef, props.setMyAnswer, joinKey]);

  return (
    <div>
      <input
        type="text"
        value={joinKey}
        onChange={(e) => setJoinKey(e.target.value)}
        onKeyUp={(e) => (e.key === "Enter" ? onJoin() : 0)}
        placeholder="(paste key here)"
      ></input>
      <button onClick={onJoin}>join game</button>
    </div>
  );
}

function Join2(props) {
  return (
    <div>
      1. send this key to your friend: <code>{props.answer}</code>
      <br />
    </div>
  );
}

function Welcome(props) {
  console.log(props.connRef);
  return (
    <div>
      <Create1 connRef={props.connRef} setMyOffer={props.setMyOffer} />
      <br />
      <Join1 connRef={props.connRef} setMyAnswer={props.setMyAnswer} />
      <br />
    </div>
  );
}

function Lobby(props) {
  const [numConn, setNumConn] = useState(0);

  useEffect(() => {
    const indx = p2p.addMessageHandler(props.connRef.current, (m) =>
      setNumConn(p2p.numConnections(props.connRef.current))
    );
    return () => {
      p2p.removeMessageHandler(props.connRef.current, indx);
    };
  }, [props.connRef]);

  return (
    <div>
      {props.offer ? (
        <Create2 connRef={props.connRef} offer={props.offer} />
      ) : (
        <Join2 connRef={props.connRef} answer={props.answer} />
      )}
      <hr />
      <button onClick={props.startGame} disabled={numConn === 0}>
        start game!
      </button>
      <hr />
      <Chat connRef={props.connRef} />
    </div>
  );
}

function Setup(props) {
  const [myOffer, setMyOffer] = useState(null);
  const [myAnswer, setMyAnswer] = useState(null);

  if (myOffer || myAnswer) {
    return (
      <Lobby
        connRef={props.connRef}
        offer={myOffer}
        answer={myAnswer}
        startGame={props.startGame}
      />
    );
  } else {
    return (
      <React.Fragment>
        <Welcome
          connRef={props.connRef}
          setMyOffer={setMyOffer}
          setMyAnswer={setMyAnswer}
        />
      </React.Fragment>
    );
  }
}

function App() {
  const [inSetup, setInSetup] = useState(true);
  const connRef = useRef();
  const gameRef = useRef();

  const startGame = useCallback(() => {
    setInSetup(false);
    logic.sendReady(gameRef.current);
  }, [gameRef]);

  useEffect(() => {
    connRef.current = p2p.createConn();
    gameRef.current = logic.createGame(connRef.current);
  }, []);

  useEffect(() => {
    const indx = p2p.addMessageHandler(connRef.current, (m) =>
      logic.receive(gameRef.current, m)
    );
    return () => {
      p2p.removeMessageHandler(connRef.current, indx);
    };
  }, [connRef, gameRef]);

  return (
    <div className="App">
      <h1>zkmao</h1>
      {inSetup && <Setup connRef={connRef} startGame={startGame} />}
      {!inSetup && <Game connRef={connRef} gameRef={gameRef} />}
    </div>
  );
}

export default App;
