import "./Game.css";
import React from "react";
import { useCallback, useRef, useEffect, useState } from "react";
import * as logic from "./logic.js";
import * as cards from "./cards.js";
import * as utils from "./utils.js";
import * as rules from "./rules.js";
import * as tokens from "./tokens.js";

import { Chat } from "./Chat.js";

function Setup() {
  return <div>waiting for everyone else to press start...</div>;
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
  const [snarkStatus, setSnarkStatus] = useState(
    logic.getSnarkStatus(props.gameRef.current)
  );

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
    console.log(utils.objectify(props.gameRef.current));
    setPlayedCards(logic.getPlayedCards(props.gameRef.current));
    setMyHand(logic.getMyHand(props.gameRef.current));
    setOppHand(logic.getOppHand(props.gameRef.current));
    setMyUserId(logic.getMyUserId(props.gameRef.current));
    setOppUserId(logic.getOppUserId(props.gameRef.current));
    setMyTurn(logic.isMyTurnEnabled(props.gameRef.current));
    setSnarkStatus(logic.getSnarkStatus(props.gameRef.current));
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
      {snarkStatus && <Loading text={snarkStatus} />}
    </div>
  );
}
function Loading(props) {
  return <div>{props.text}...</div>;
}

function SelectRule(props) {
  return (
    <div style={{ marginTop: "5px", marginBottom: "7px" }}>
      actions:{props.rules.length === 0 ? " (none)" : ""}
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
        play!
      </button>
      <button onClick={props.pass} disabled={props.disabled}>
        pass
      </button>
    </div>
  );
}

function PlayedCards(props) {
  return (
    <div style={{ margin: "5px" }}>
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
  return <SelectableDeck cards={props.cards} disabled={true} />;
}
function SelectableDeck(props) {
  if (props.cards.length === 0) {
    return <div>(none)</div>;
  }
  return (
    <div style={{ fontSize: "4em" }} className="SelectableDeck">
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
              disabled={props.disabled}
            />
            <label
              htmlFor={cards.serializeCardASCII(card)}
              key={`mycardslabel${index}`}
              style={props.disabled ? { cursor: "default" } : {}}
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
  const [winner, setWinner] = useState(logic.getWinner(props.gameRef.current));
  const [readyToRestart, setReadyToRestart] = useState(
    logic.isReadyToRestart(props.gameRef.current)
  );
  const [endedWithCards, setEndedWithCards] = useState(
    logic.getMyHand(props.gameRef.current).length
  );
  const [readyToDrawTokens, setReadyToDrawTokens] = useState(
    logic.isReadyToDrawTokens(props.gameRef.current)
  );
  const [nTokens, setNtokens] = useState(
    logic.myAwardedTokens(props.gameRef.current)
  );
  const [myAvailableTokens, setMyAvailableTokens] = useState(
    logic.myAvailableTokens(props.gameRef.current)
  );
  const [canSubmit, setCanSubmit] = useState(
    logic.canSubmitRule(props.gameRef.current)
  );
  const [snarkStatus, setSnarkStatus] = useState(
    logic.getTokenSnarkStatus(props.gameRef.current)
  );

  const updateGameState = useCallback(() => {
    setWinner(logic.getWinner(props.gameRef.current));
    setReadyToRestart(logic.isReadyToRestart(props.gameRef.current));
    setEndedWithCards(logic.getMyHand(props.gameRef.current).length);
    setReadyToDrawTokens(logic.isReadyToDrawTokens(props.gameRef.current));
    setNtokens(logic.myAwardedTokens(props.gameRef.current));
    setMyAvailableTokens(logic.myAvailableTokens(props.gameRef.current));
    setCanSubmit(logic.canSubmitRule(props.gameRef.current));
    setSnarkStatus(logic.getTokenSnarkStatus(props.gameRef.current));
  }, [props.gameRef]);

  useEffect(() => {
    const indx = logic.addListener(props.gameRef.current, updateGameState);
    return () => {
      logic.removeListener(props.gameRef.current, indx);
    };
  }, [props.gameRef, updateGameState]);

  return (
    <div>
      <div style={{ fontSize: "2em" }}>
        game over!! {winner === props.userId ? "you" : winner} won!
      </div>
      because you ended with {endedWithCards} card
      {endedWithCards === 1 ? "" : "s"} left, you are awarded {nTokens} token
      {nTokens === 1 ? "" : "s"}, randomly drawn from the available tokens:
      <br />
      <button
        onClick={() => logic.drawTokens(props.gameRef.current)}
        disabled={!readyToDrawTokens}
      >
        draw {nTokens} token{nTokens === 1 ? "" : "s"}!
      </button>
      <CreateRule
        tokens={myAvailableTokens}
        gameRef={props.gameRef}
        canSubmit={canSubmit}
      />
      {readyToRestart && (
        <button onClick={() => logic.restartGame(props.gameRef.current)}>
          play again!
        </button>
      )}
      {snarkStatus && <Loading text={snarkStatus} />}
    </div>
  );
}

function CreateRule(props) {
  const [rule, setRule] = useState("");
  const [selectedToken, setSelectedToken] = useState(null);
  const [ruleName, setRuleName] = useState("");

  const zeroTokens = props.tokens.filter((t) => t.tokenPower > 0).length === 0;

  return (
    <div>
      create a rule:
      <br />
      {!zeroTokens && "token (# penalty cards):"}{" "}
      {props.tokens
        .filter((t) => t.tokenPower > 0)
        .map((token, index) => {
          return (
            <React.Fragment key={`token${index}`}>
              <input
                type="radio"
                name="tokens"
                value={token.tokenPower}
                checked={
                  selectedToken === null ? false : selectedToken.id === token.id
                }
                onChange={() => setSelectedToken(token)}
                id={token.id}
                key={`tokeninp${index}`}
              />
              <label htmlFor={token.id} key={`tokenlab${index}`}>
                {token.tokenPower}
              </label>
            </React.Fragment>
          );
        })}
      {!zeroTokens && <br />}
      {zeroTokens && (
        <React.Fragment>
          <span>
            you don't have any valuable tokens so you can't create any rules :(
          </span>
          <br />
        </React.Fragment>
      )}
      <input
        type="text"
        value={ruleName}
        onChange={(e) => setRuleName(e.target.value)}
        placeholder="(rule name)"
        disabled={!props.canSubmit || zeroTokens}
      />
      <br />
      <span style={{ fontSize: "0.8em", color: "rgba(0,0,0,0.5)" }}>
        {
          "function rule(card1: number, card2: number, lastcard: boolean) -> boolean:"
        }
      </span>
      <br />
      <textarea
        style={{ width: "250px", height: "50px" }}
        value={rule}
        onChange={(e) => setRule(e.target.value)}
        placeholder="(rule code)"
        disabled={!props.canSubmit || zeroTokens}
      />
      <br />
      <button
        onClick={() => {
          if (selectedToken === null) {
            return alert("pls select a token");
          }
          if (ruleName === "") {
            return alert("pls enter a rule name");
          }
          if (rule === "") {
            return alert("pls enter rule code");
          }
          logic.submitRule(
            props.gameRef.current,
            rule,
            ruleName,
            selectedToken
          );
        }}
        disabled={!props.canSubmit || zeroTokens}
      >
        create rule!
      </button>
      <button
        onClick={() =>
          logic.submitRule(props.gameRef.current, null, null, null)
        }
        disabled={!props.canSubmit}
      >
        skip creating a rule
      </button>
    </div>
  );
}

function Rules(props) {
  return (
    <div>
      active rules:{" "}
      {props.rules.length > 0 && (
        <ul>
          {props.rules.map((rule) => {
            return (
              <li key={rule.hash}>
                <Rule rule={rule} key={rule.hash} />
              </li>
            );
          })}
        </ul>
      )}
      {props.rules.length === 0 && <span>(none)</span>}
    </div>
  );
}
function Rule(props) {
  const rule = props.rule;
  return (
    <span title={"hash: " + rule.hash}>
      {rule.name} (penalty {rule.penalty}, owned by {rule.owner})
    </span>
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
          <GameOver gameRef={props.gameRef} userId={myUserId} />
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
