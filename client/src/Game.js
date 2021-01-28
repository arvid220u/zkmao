import "./Game.css";
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
    logic.getPlayedCards(props.gameRef.current)
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
  const [selectedCard, setSelectedCard] = useState(null);
  const [myTurn, setMyTurn] = useState(
    logic.isMyTurnEnabled(props.gameRef.current)
  );
  const changeCard = useCallback((e) => {
    setSelectedCard(e.currentTarget.value);
  }, []);

  const updateGameState = useCallback(() => {
    setPlayedCards(logic.getPlayedCards(props.gameRef.current));
    setMyHand(logic.getMyHand(props.gameRef.current));
    setOppHand(logic.getOppHand(props.gameRef.current));
    setMyUserId(logic.getMyUserId(props.gameRef.current));
    setOppUserId(logic.getOppUserId(props.gameRef.current));
    setMyTurn(logic.isMyTurnEnabled(props.gameRef.current));
  }, [props.gameRef]);

  useEffect(() => {
    const indx = logic.addListener(props.gameRef.current, updateGameState);
    return () => {
      logic.removeListener(props.gameRef.current, indx);
    };
  }, [props.gameRef, updateGameState]);

  return (
    <div>
      <Hand cards={oppHand} user={oppUserId} />
      <PlayedCards cards={playedCards} />
      <MyHand
        cards={myHand}
        user={myUserId}
        changeCard={changeCard}
        selectedCard={selectedCard}
      />
      <PlayButton
        disabled={!myTurn || props.disabled}
        play={() =>
          logic.playCard(
            props.gameRef.current,
            cards.deserializeCard(selectedCard)
          )
        }
        pass={() => logic.playCard(props.gameRef.current, cards.VOID_CARD)}
      />
    </div>
  );
}

function PlayButton(props) {
  return (
    <div>
      <button onClick={props.play} disabled={props.disabled}>
        Play!
      </button>
      <button onClick={props.pass} disabled={props.disabled}>
        Pass
      </button>
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
function MyHand(props) {
  return (
    <div>
      my cards:
      <SelectableDeck
        cards={props.cards}
        changeCard={props.changeCard}
        selectedCard={props.selectedCard}
      />
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
function SelectableDeck(props) {
  if (props.cards.length === 0) {
    return <div>(none)</div>;
  }
  return (
    <div style={{ fontSize: "3em" }} className="SelectableDeck">
      {props.cards.map((card, index) => {
        return (
          <React.Fragment key={`mycardsfragment${index}`}>
            <input
              type="radio"
              name="mycards"
              value={cards.serializeCard(card)}
              checked={props.selectedCard === cards.serializeCard(card)}
              onChange={props.changeCard}
              id={cards.serializeCardASCII(card)}
              key={`mycardsradio${index}`}
            />
            <label
              htmlFor={cards.serializeCardASCII(card)}
              key={`mycardslabel${index}`}
            >
              {cards.serializeCard(card)}
            </label>
          </React.Fragment>
        );
      })}
    </div>
  );
}

function GameOver(props) {
  return (
    <div>
      <div style={{ fontSize: "2em" }}>
        Game is over!!!! {props.winner} won!
      </div>
      <button onClick={() => logic.restartGame(props.gameRef.current)}>
        Play again!
      </button>
    </div>
  );
}

function Rules(props) {
  const [rules, setRules] = useState(logic.getRules(props.gameRef.current));

  const updateGameState = useCallback(() => {
    setRules(logic.getRules(props.gameRef.current));
  }, [props.gameRef]);

  useEffect(() => {
    const indx = logic.addListener(props.gameRef.current, updateGameState);
    return () => {
      logic.removeListener(props.gameRef.current, indx);
    };
  }, [props.gameRef, updateGameState]);

  return (
    <div>
      Rules:
      <ul>
        {rules.map((rule) => {
          return <li>{JSON.stringify(rule)}</li>;
        })}
      </ul>
    </div>
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
      {phase === logic.PHASE.GAMEOVER && (
        <React.Fragment>
          <GameOver
            gameRef={props.gameRef}
            winner={logic.getWinner(props.gameRef.current)}
          />
          <hr />
        </React.Fragment>
      )}
      {phase === logic.PHASE.SETUP && (
        <React.Fragment>
          <Setup />
          <hr />
        </React.Fragment>
      )}
      <Rules gameRef={props.gameRef} />
      <hr />
      {(phase === logic.PHASE.PLAY || phase === logic.PHASE.GAMEOVER) && (
        <React.Fragment>
          <Play
            gameRef={props.gameRef}
            disabled={phase === logic.PHASE.GAMEOVER}
          />
          <hr />
        </React.Fragment>
      )}
      <Chat connRef={props.connRef} />
    </div>
  );
}
