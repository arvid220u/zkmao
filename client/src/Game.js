import "./App.css";
import React from "react";
import { useCallback, useRef, useEffect, useState } from "react";
import * as p2p from "./p2p.js";
import * as logic from "./logic.js";

import { Chat } from "./Chat.js";

export function Game(props) {
  return (
    <div>
      welcome to the game good sir!
      <hr />
      <Chat connRef={props.connRef} />
    </div>
  );
}
