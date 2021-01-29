// logic.js is intended to hold all game logic

import seedrandom from "seedrandom";

import * as p2p from "./p2p.js";
import * as utils from "./utils.js";
import * as cards from "./cards.js";
import * as config from "./config.js";
import * as rules from "./rules.js";

import assert from "./assert.js";

// what's the game state?
// there's a public part and a private part
// the public part needs to be agreed upon among all players
// the private part is
//
// PUBLIC:
// for version 1:
// 1: the middle deck, which has order
// 2: each player's hand, which does not have order
//      invariant: all disjoint, union is all cards
//
// for version 2:
// 3: all the rule hashes
// 4:
//
// PRIVATE:
// for version 2:
// 1: your own rules (which is in the form of uhhhh)
//
//
//
// TODO: later version: add signatures to actually be secure

// WIRE PROTOCOL:
// always assume broadcast messages!!!!!! this allows us to assume synchronicity which makes everything so much simpler
// 1. setup:
//  1.1 everyone: READY hashOfRandomNumber userID (number is a 64-bit integers, user id is randomly generated (later should be public key))
//  1.2 when everyone you have open connections with say READY: START randomNumber  (userID is sent with every message)
//  1.3 when received all STARTs: verifies all hashes, xors all numbers, seed rng with this, then just pick cards
//  1.4 using same seed just choose order
// 2. play:
//  2.1 someone: PLAY card userID rules provedRules (same as for playack, need to show you enforce rules consistently even for yourself)
//  2.2 everyone else: PLAYACK card user userID provedRules (rulehash, snark proof, for each rule you know)
// 3. abort:
//  3.1 send ABORT userID to every user, be sad

// ok dont overthink it
// i think having a hierarchical state thing makes sense
// this is javascript not rust

// we assume that messages come to people in the order they are sent
// i.e. we assume that channels are FIFO

// ok so we have:
// phase = {"setup", "play", "gameover", "abort"}
// each phase has some metadata, which can be public or private
// the public metadata is always sent over for debugging purposes

// transitions
// setup:
//      state = {"preReady","sentReady","sentStart"},
//      players, readyHashes, startNumbers, myRandom
//
// play:
//      nextTurn = index into players
//      players (order matters),
//      playedCards (0 bottom, n-1 top),
//      playerHands (id -> array),
//      state = {"waitforplay", "waitforack"}
//      acksReceived = []
//      lastPlayedCard
//      lastPlayedUser
//
// gameover: (transitions directly to setup.sentReady)
//      winner = user_id
//
// abort:
//      (no data)

export const PHASE = {
  SETUP: "SETUP",
  PLAY: "PLAY",
  GAMEOVER: "GAMEOVER",
  ABORT: "ABORT",
};
const PHASES = Object.values(PHASE);
const SETUP_STATE = {
  PRE_READY: "PRE_READY",
  SENT_READY: "SENT_READY",
  SENT_START: "SENT_START",
};
const SETUP_STATES = Object.values(SETUP_STATE);
const PLAY_STATE = {
  WAIT_FOR_PLAY: "WAIT_FOR_PLAY",
  WAIT_FOR_PLAYACK: "WAIT_FOR_PLAYACK",
};
const PLAY_STATES = Object.values(PLAY_STATE);

const METHOD = {
  READY: "READY",
  START: "START",
  PLAY: "PLAY",
  PLAYACK: "PLAYACK",
  ABORT: "ABORT",
};
const METHODS = Object.values(METHOD);
const METHOD_HANDLER = {
  [METHOD.READY]: handleReadyMethod,
  [METHOD.START]: handleStartMethod,
  [METHOD.PLAY]: handlePlayMethod,
  [METHOD.PLAYACK]: handlePlayAckMethod,
  [METHOD.ABORT]: handleAbortMethod,
};
assert(
  JSON.stringify(METHODS) === JSON.stringify(Object.keys(METHOD_HANDLER)),
  {
    methods: METHODS,
    handlers: METHOD_HANDLER,
  }
);

export function createGame(conn) {
  // TODO: generate private/public keypair here and let userId be the public key
  const userId = Math.random().toString(36).substr(2, 9);
  const game = {
    conn,
    listeners: {},
    listenerIndex: "0",
    userId: userId,
    phase: null,
    data: {}, // contains data for every phase

    // rule data
    myRules: [],
    allRules: [],
  };
  for (const phase of PHASES) {
    game.data[phase] = {};
  }
  initPhase(game, PHASE.SETUP);
  setUpPublicRules(game);
  return game;
}
function setUpPublicRules(game) {
  // TODO: add more public rules
  rules
    .createPrivateRule("spades", "card.suit == spades", rules.EVERYONE)
    .then((rule) => {
      game.myRules.push(rule);
      const publicRule = rules.publicRule(rule);
      game.allRules.push(publicRule);
      update(game);
    })
    .then(() => {
      return rules.createPrivateRule(
        "lastcard",
        "isLastCard()",
        rules.EVERYONE
      );
    })
    .then((rule) => {
      game.myRules.push(rule);
      const publicRule = rules.publicRule(rule);
      game.allRules.push(publicRule);
      update(game);
    });
}
function resetPhase(game, phase, args) {
  assert(PHASES.includes(phase), game);
  let data = {};
  if (phase === PHASE.SETUP) {
    data = {
      state: SETUP_STATE.PRE_READY,
      players: [game.userId],
      readyHashes: {},
      startNumbers: {},
      myRandom: null,
    };
  } else if (phase === PHASE.PLAY) {
    // shuffle the player list
    // note: we need to sort it first before we do it so everyone gets the same list

    data.players = utils.shuffle(
      [...game.data[PHASE.SETUP].players].sort(),
      args.rng
    );

    data.nextTurn = 0;

    data.playedCards = []; // start empty

    // now deal cards
    data.playerHands = cards.dealShuffledCards(
      utils.shuffle(data.players, args.rng),
      args.rng,
      config.START_FROM_RANK
    );

    data.state = PLAY_STATE.WAIT_FOR_PLAY;

    data.acksReceived = [];
    data.lastPlayedCard = null;
    data.lastPlayedUser = null;
  }
  game.data[phase] = data;
}
function initPhase(game, phase, args) {
  assert(PHASES.includes(phase), game);
  resetPhase(game, phase, args);
  game.phase = phase;
}
export function addListener(game, listener) {
  const indx = game.listenerIndex;
  game.listeners[indx] = listener;
  game.listenerIndex = `${parseInt(indx) + 1}`;
  return indx;
}
export function removeListener(game, key) {
  if (!game) return;
  console.log(`removing key ${key} from game ${game}`);
  console.log(game);
  delete game.listeners[key];
}
// this function needs to be called every time the game state is updated!!!!!!!!
function update(game) {
  for (let listener of Object.values(game.listeners)) {
    listener();
  }
}

// m should be on form {data: , method: , ...}
export function receive(game, m) {
  console.log("game receiving message!");
  console.log(m);
  if (m.type !== "data") {
    console.log("ignoring non-data message");
    return;
  }
  assert(METHODS.includes(m.method));
  console.log(METHOD_HANDLER);
  METHOD_HANDLER[m.method](game, m);
}
function send(game, m) {
  // TODO: sign the message
  m["from"] = game.userId;
  p2p.sendData(game.conn, m);
}

function handleReadyMethod(game, m) {
  // should be in setup phase, or gameover phase
  if (!(game.phase === PHASE.SETUP || game.phase === PHASE.GAMEOVER))
    return abort(game);
  const data = game.data[PHASE.SETUP];
  // should not have sent start already
  if (
    !(
      data.state === SETUP_STATE.PRE_READY ||
      data.state === SETUP_STATE.SENT_READY
    )
  ) {
    return abort(game);
  }

  const user = m.from;
  const hash = m.hash;

  // shouldn't receive twice; should have different IDs
  if (data.players.includes(user)) return abort(game);

  data.players.push(user);
  data.readyHashes[user] = hash;

  // if we have received all, send start
  maybeSendStart(game);

  update(game);
}
async function handleStartMethod(game, m) {
  // should be in setup phase
  if (game.phase !== PHASE.SETUP) return abort(game, "wrong phase");
  const data = game.data[PHASE.SETUP];
  // should have sent ready (not necessarily should have sent start though)
  if (
    !(
      data.state === SETUP_STATE.SENT_READY ||
      data.state === SETUP_STATE.SENT_START
    )
  ) {
    return abort(game);
  }

  const user = m.from;
  const randomNumber = m.randomNumber;

  // shouldn't receive twice
  if (Object.keys(data.startNumbers).includes(user)) return abort(game);

  // should receive from verified user
  if (!data.players.includes(user)) return abort(game, `unknown user ${user}`);

  // assert that the hash is ok
  const randomNumberHash = await utils.hash(`${randomNumber}`);
  if (data.readyHashes[user] !== randomNumberHash)
    return abort(
      game,
      `incorrect hash ${randomNumberHash} received for random number ${randomNumber} from user ${user}`
    );

  // add to numbers
  data.startNumbers[user] = randomNumber;

  // if we have received all, go to the game!!
  maybeStartGame(game);

  update(game);
}
function handlePlayMethod(game, m) {
  if (game.phase !== PHASE.PLAY) return abort(game, "wrong phase");
  const data = game.data[game.phase];
  if (data.state !== PLAY_STATE.WAIT_FOR_PLAY)
    return abort(game, "wrong state");

  const user = m.from;
  const card = m.card;
  const selectedRules = m.rules;

  // make sure it is this user's turn
  if (user !== data.players[data.nextTurn]) {
    return abort(game, "user tried to make move but it's not their turn");
  }

  // make sure this user owns this card (or it is voidcard)
  if (
    card !== cards.VOID_CARD &&
    !data.playerHands[user].some((c) => cards.sameCard(c, card))
  ) {
    return abort(game, "user tried to play card not in their hand");
  }

  // make sure the card move is legal
  if (!legalToPlayCard(game, card)) {
    return abort(game, "user tried to play illegal card");
  }

  // actually do the move
  actuallyPlayCard(game, user, card);

  sendPlayAck(game, user, card, selectedRules);

  update(game);
}
function handlePlayAckMethod(game, m) {
  if (game.phase !== PHASE.PLAY) return abort(game, "wrong phase");
  const data = game.data[game.phase];
  if (data.state !== PLAY_STATE.WAIT_FOR_PLAYACK)
    return abort(game, "wrong state");

  const user = m.user;
  const from = m.from;
  const card = m.card;

  // make sure the right user n right card was acked
  if (user !== data.lastPlayedUser) {
    return abort(game, "tried to ack the wrong user");
  }
  if (!cards.sameCard(card, data.lastPlayedCard)) {
    return abort(game, "tried to ack the wrong card");
  }

  if (data.acksReceived.includes(from)) {
    return abort(game, "already received ack from this user");
  }

  // TODO: verify the zk snarks

  data.acksReceived.push(from);

  maybeStopWaitingForAcks(game);

  update(game);
}
function handleAbortMethod(game, m) {
  console.log("ABORTING :(((( SAD");
  utils.unimplemented();

  update(game);
}

function abort(game, reason) {
  console.error("ABORT GAME :((");
  console.error(reason);
  send(game, { method: METHOD.ABORT, reason });
  game.phase = PHASE.ABORT;

  update(game);
}

function actuallyPlayCard(game, user, card) {
  const data = game.data[game.phase];
  data.nextTurn = (data.nextTurn + 1) % data.players.length;
  data.state = PLAY_STATE.WAIT_FOR_PLAYACK;
  data.lastPlayedCard = card;
  data.lastPlayedUser = user;
  if (card !== cards.VOID_CARD) {
    data.playedCards.push(card);
    data.playerHands[user] = data.playerHands[user].filter(
      (c) => c.index !== card.index
    );
  }
  update(game);
}

function legalToPlayCard(game, card) {
  const data = game.data[game.phase];
  // always ok to pass
  if (card === cards.VOID_CARD) return true;
  // first move always legal
  if (data.playedCards.length === 0) return true;
  // either suit or rank must be the same
  const lastCard = data.playedCards[data.playedCards.length - 1];
  return lastCard.suit === card.suit || lastCard.rank === card.rank;
}

export function playCard(game, card, selectedRules) {
  assert(game.phase === PHASE.PLAY && isMyTurn(game), game);
  const data = game.data[game.phase];
  assert(data.state === PLAY_STATE.WAIT_FOR_PLAY, game);
  assert(
    card === cards.VOID_CARD ||
      data.playerHands[game.userId].some((c) => cards.sameCard(c, card)),
    game
  );
  assert(
    selectedRules.every(
      (rule) => game.allRules.filter((x) => rules.sameRule(x, rule)) > 0
    )
  );
  console.log(`play card!`);
  console.log(card);
  console.log(selectedRules);

  assert(legalToPlayCard(game, card), game);

  // we do this for ourselves. we need to run the snarks
  // to prove to others that we enforce our own rules correctly even on ourselves
  const provedRules = rules.determinePenalties(
    card,
    data.playedCards.slice(0, data.playedCards.length - 1),
    selectedRules,
    game.myRules
  );
  // TODO: record how many penalties were received (probably 0 lol u should know your own rules)

  send(game, { method: METHOD.PLAY, card, rules: selectedRules, provedRules });

  actuallyPlayCard(game, game.userId, card);
  update(game);
}

export function restartGame(game) {
  game.phase = PHASE.SETUP;

  sendReady(game);
}

export async function sendReady(game) {
  assert(game.phase === PHASE.SETUP, game);
  const data = game.data[PHASE.SETUP];
  assert(data.state === SETUP_STATE.PRE_READY, game);
  // generate a random number
  data.myRandom = Math.floor(Math.random() * 2 ** 64);
  // hash the random number
  const hash_r = await utils.hash(`${data.myRandom}`);
  console.log(hash_r);
  data.readyHashes[game.userId] = hash_r;
  send(game, { method: METHOD.READY, hash: hash_r });
  data.state = SETUP_STATE.SENT_READY;
  maybeSendStart(game);

  update(game);
}

function checkIfWon(game) {
  assert(game.phase === PHASE.PLAY, game);
  const data = game.data[game.phase];
  assert(data.state === PLAY_STATE.WAIT_FOR_PLAY, game);

  for (const user of data.players) {
    if (data.playerHands[user].length === 0) {
      // someone won!!!!
      // assert only one player won
      assert(
        Object.values(data.playerHands).filter((l) => l.length === 0).length ===
          1
      );

      game.phase = PHASE.GAMEOVER;
      game.data[PHASE.GAMEOVER].winner = user;
    }
  }
}

function maybeStopWaitingForAcks(game) {
  const data = game.data[game.phase];
  // everyone except the player needs to ack the card
  if (data.acksReceived.length === data.players.length - 1) {
    data.state = PLAY_STATE.WAIT_FOR_PLAY;
    data.acksReceived = [];
    data.lastPlayedCard = null;
    data.lastPlayedUser = null;

    // check if someone won
    checkIfWon(game);

    update(game);
  }
}

function sendPlayAck(game, user, card, selectedRules) {
  assert(game.phase === PHASE.PLAY, game);
  const data = game.data[game.phase];
  assert(data.state === PLAY_STATE.WAIT_FOR_PLAYACK, game);

  const provedRules = rules.determinePenalties(
    card,
    data.playedCards.slice(0, data.playedCards.length - 1),
    selectedRules,
    game.myRules
  );
  // TODO: record how many penalties were received

  send(game, { method: METHOD.PLAYACK, card, user, provedRules });

  assert(!data.acksReceived.includes(game.userId), game);
  data.acksReceived.push(game.userId);

  maybeStopWaitingForAcks(game);

  update(game);
}

function maybeStartGame(game) {
  const data = game.data[game.phase];
  if (data.players.length === Object.keys(data.startNumbers).length) {
    startGame(game);
  }
}
function startGame(game) {
  assert(game.phase === PHASE.SETUP);
  const data = game.data[game.phase];
  assert(data.state === SETUP_STATE.SENT_START, game);

  // xor all the random numbers (which means that as long as at least 1 person honest, it is random)
  let finalRandomNumber = 0;
  Object.values(data.startNumbers).forEach((randomNumber) => {
    finalRandomNumber ^= randomNumber;
  });

  console.log(`final randomness: ${finalRandomNumber}`);
  // use this random number as the seed of an rng
  let rng = seedrandom(`${finalRandomNumber}`);

  // now we can transition to the game phase
  // delete the old game object properties
  initPhase(game, PHASE.PLAY, { rng });
  resetPhase(game, PHASE.SETUP);

  console.log("STARTING GAME!!!! exciting :)))");
  console.log(game);

  update(game);
}

function maybeSendStart(game) {
  const data = game.data[PHASE.SETUP];
  if (
    p2p.numConnections(game.conn) ===
    Object.keys(data.readyHashes).length - 1
  ) {
    assert(data.players.length === Object.keys(data.readyHashes).length, game);
    sendStart(game);
  }
}
function sendStart(game) {
  assert(game.phase === PHASE.SETUP, game);
  const data = game.data[game.phase];
  assert(data.state === SETUP_STATE.SENT_READY, game);

  send(game, { method: METHOD.START, randomNumber: data.myRandom });

  data.startNumbers[game.userId] = data.myRandom;
  data.state = SETUP_STATE.SENT_START;

  maybeStartGame(game);

  update(game);
}

// convenience for 2 players
// TODO: update this for more players

export function getMyUserId(game) {
  return game.userId;
}
export function getOppUserId(game) {
  const data = game.data[PHASE.PLAY];
  const oppUserId = data.players.filter((x) => x !== getMyUserId(game))[0];
  console.log(`opp user id: ${oppUserId}`);
  return oppUserId;
}
export function getMyHand(game) {
  const data = game.data[PHASE.PLAY];
  return data.playerHands[getMyUserId(game)];
}
export function getOppHand(game) {
  const data = game.data[PHASE.PLAY];
  const playerHand = data.playerHands[getOppUserId(game)];
  console.log("player hand!");
  console.log(JSON.stringify(playerHand));
  return playerHand;
}
function isMyTurn(game) {
  const data = game.data[PHASE.PLAY];
  return getMyUserId(game) === data.players[data.nextTurn];
}
export function isMyTurnEnabled(game) {
  const data = game.data[PHASE.PLAY];
  return isMyTurn(game) && data.state === PLAY_STATE.WAIT_FOR_PLAY;
}

export function getPlayedCards(game) {
  const data = game.data[PHASE.PLAY];
  return data.playedCards;
}

export function getWinner(game) {
  const data = game.data[PHASE.GAMEOVER];
  return data.winner;
}

export function getRules(game) {
  return game.allRules;
}
