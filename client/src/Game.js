import "./App.css";
import React from "react";
import { useCallback, useRef, useEffect, useState } from "react";
import * as p2p from "./p2p.js";
import * as logic from "./logic.js";

import { Chat } from "./Chat.js";

function Setup() {
  return <div>Waiting for everyone else to press start...</div>;
}

export function Game(props) {
  return (
    <div>
      welcome to the game good sir!
      <hr />
      {props.gameRef.current.phase === logic.PHASE.SETUP && <Setup />}
      <hr />
      <Chat connRef={props.connRef} />
    </div>
  );
}
