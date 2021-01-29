import "./Game.css";
import React from "react";
import { useCallback, useRef, useEffect, useState } from "react";
import * as p2p from "./p2p.js";
import * as logic from "./logic.js";
import * as cards from "./cards.js";
import * as rules from "./rules.js";
import * as tokens from "./tokens.js";

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
  const [selectedRules, setSelectedRules] = useState([]);

  const changeCard = useCallback((e) => {
    setSelectedCard(e.currentTarget.value);
  }, []);

  const toggleRule = useCallback(
    (e) => {
      const rule = JSON.parse(e.currentTarget.value);
      console.log(`toggling rule ${rule.name}`);
      if (selectedRules.filter((x) => rules.sameRule(x, rule)).length > 0) {
        setSelectedRules(selectedRules.filter((x) => !rules.sameRule(x, rule)));
      } else {
        setSelectedRules([rule, ...selectedRules]);
      }
    },
    [selectedRules]
  );

  const updateGameState = useCallback(() => {
    console.log("updating game state in Play :))))))");
    console.log(JSON.parse(JSON.stringify(props.gameRef.current)));
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
      <SelectRule
        rules={props.rules}
        selectedRules={selectedRules}
        toggleRule={toggleRule}
      />
      <PlayButton
        disabled={!myTurn || props.disabled}
        play={() => {
          if (selectedCard === null) {
            return alert("pls select a card!");
          }
          logic.playCard(
            props.gameRef.current,
            cards.deserializeCard(selectedCard),
            selectedRules
          );
          setSelectedRules([]);
          setSelectedCard(null);
        }}
        pass={() => {
          logic.playCard(props.gameRef.current, cards.VOID_CARD, selectedRules);
          setSelectedRules([]);
          setSelectedCard(null);
        }}
      />
    </div>
  );
}

function SelectRule(props) {
  return (
    <div style={{ marginTop: "5px", marginBottom: "7px" }}>
      rules:
      <div className="SelectRule">
        {props.rules.map((rule, index) => {
          return (
            <React.Fragment key={`rulesfragment${index}`}>
              <input
                type="checkbox"
                name="rules"
                value={JSON.stringify(rule)}
                checked={
                  props.selectedRules.filter((x) => rules.sameRule(x, rule))
                    .length > 0
                }
                onChange={props.toggleRule}
                id={rule.hash}
                key={`rulesradio${index}`}
              />
              <label htmlFor={rule.hash} key={`ruleslabel${index}`}>
                {rule.name}
              </label>
            </React.Fragment>
          );
        })}
      </div>
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
  return (
    <div>
      Rules:
      <ul>
        {props.rules.map((rule) => {
          return <li key={rule.hash}>{JSON.stringify(rule)}</li>;
        })}
      </ul>
    </div>
  );
}

function Tokens(props) {
  const tokenStock = props.tokens.filter(
    (token) => token.state === tokens.TOKEN_STATE.STOCK
  );
  const myTokens = props.tokens.filter(
    (token) => token.state === tokens.TOKEN_STATE.HAND
  );

  return (
    <div>
      my tokens:{" "}
      {myTokens.length === 0 ? "none" : tokens.serializeTokens(myTokens)}{" "}
      (available tokens: {tokens.serializeTokens(tokenStock)})
    </div>
  );
}

export function Game(props) {
  const [phase, setPhase] = useState(props.gameRef.current.phase);
  const [myUserId, setMyUserId] = useState(
    logic.getMyUserId(props.gameRef.current)
  );
  const [rules, setRules] = useState(logic.getRules(props.gameRef.current));
  const [tokens, setTokens] = useState(
    logic.getMyTokens(props.gameRef.current)
  );

  const updateGameState = useCallback(() => {
    setPhase(props.gameRef.current.phase);
    setMyUserId(logic.getMyUserId(props.gameRef.current));
    setRules(logic.getRules(props.gameRef.current));
    setTokens(logic.getMyTokens(props.gameRef.current));
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
      <Rules rules={rules} />
      {tokens && <Tokens tokens={tokens} />}
      <hr />
      {(phase === logic.PHASE.PLAY || phase === logic.PHASE.GAMEOVER) && (
        <React.Fragment>
          <Play
            gameRef={props.gameRef}
            disabled={phase === logic.PHASE.GAMEOVER}
            rules={rules}
          />
          <hr />
        </React.Fragment>
      )}
      <Chat connRef={props.connRef} />
    </div>
  );
}
