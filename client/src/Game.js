import "./App.css";
import React from "react";
import { useCallback, useRef, useEffect, useState } from "react";
import * as p2p from "./p2p.js";
import * as logic from "./logic.js";
import * as cards from "./cards.js";

import { Chat } from "./Chat.js";

function Setup() {
  return <div>Waiting for everyone else to press start...</div>;
}

function Play(props) {
  const [playedCards, setPlayedCards] = useState(
    props.gameRef.current.playedCards
  );
  const [myHand, setMyHand] = useState(logic.getMyHand(props.gameRef.current));
  const [oppHand, setOppHand] = useState(
    logic.getOppHand(props.gameRef.current)
  );
  const [myUserId, setMyUserId] = useState(
    logic.getMyUserId(props.gameRef.current)
  );
  const [oppUserId, setOppUserId] = useState(
    logic.getOppUserId(props.gameRef.current)
  );

  const updateGameState = useCallback(() => {
    setPlayedCards(props.gameRef.current.playedCards);
    setMyHand(logic.getMyHand(props.gameRef.current));
    setOppHand(logic.getOppHand(props.gameRef.current));
    setMyUserId(logic.getMyUserId(props.gameRef.current));
    setOppUserId(logic.getOppUserId(props.gameRef.current));
  }, [props.gameRef]);

  useEffect(() => {
    const indx = logic.addListener(props.gameRef.current, updateGameState);
    return () => {
      logic.removeListener(props.gameRef.current, indx);
    };
  }, [props.gameRef, updateGameState]);

  return (
    <div>
      Playing the game!!!
      <hr />
      <Hand cards={oppHand} user={oppUserId} />
      <PlayedCards cards={playedCards} />
      <Hand cards={myHand} user={myUserId} />
    </div>
  );
}

function PlayedCards(props) {
  return (
    <div>
      played cards: <Deck cards={props.cards} />
    </div>
  );
}

function Hand(props) {
  return (
    <div>
      {props.user}'s cards:
      <Deck cards={props.cards} />
    </div>
  );
}

function Deck(props) {
  if (props.cards.length === 0) {
    return <div>(none)</div>;
  }
  return (
    <div style={{ fontSize: "3em" }}>{cards.serializeDeck(props.cards)}</div>
  );
}

export function Game(props) {
  const [phase, setPhase] = useState(props.gameRef.current.phase);
  const [myUserId, setMyUserId] = useState(
    logic.getMyUserId(props.gameRef.current)
  );

  const updateGameState = useCallback(() => {
    setPhase(props.gameRef.current.phase);
    setMyUserId(logic.getMyUserId(props.gameRef.current));
  }, [props.gameRef]);

  useEffect(() => {
    const indx = logic.addListener(props.gameRef.current, updateGameState);
    return () => {
      logic.removeListener(props.gameRef.current, indx);
    };
  }, [props.gameRef, updateGameState]);

  return (
    <div>
      welcome to the game, {myUserId}!
      <hr />
      {phase === logic.PHASE.SETUP && <Setup />}
      {phase === logic.PHASE.PLAY && <Play gameRef={props.gameRef} />}
      <hr />
      <Chat connRef={props.connRef} />
    </div>
  );
}
