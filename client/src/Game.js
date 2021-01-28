import "./App.css";
import React from "react";
import { useCallback, useRef, useEffect, useState } from "react";
import * as p2p from "./p2p.js";
import * as logic from "./logic.js";

import { Chat } from "./Chat.js";

function Setup() {
  return <div>Waiting for everyone else to press start...</div>;
}

function Play() {
  return <div>Playing the game!!!</div>;
}

export function Game(props) {
  const [phase, setPhase] = useState(props.gameRef.current.phase);

  const updateGameState = useCallback(() => {
    setPhase(props.gameRef.current.phase);
  }, [props.gameRef]);

  useEffect(() => {
    const indx = logic.addListener(props.gameRef.current, updateGameState);
    return () => {
      logic.removeListener(props.gameRef.current, indx);
    };
  }, [props.gameRef]);

  return (
    <div>
      welcome to the game good sir!
      <hr />
      {phase === logic.PHASE.SETUP && <Setup />}
      {phase === logic.PHASE.PLAY && <Play gameRef={props.gameRef} />}
      <hr />
      <Chat connRef={props.connRef} />
    </div>
  );
}
