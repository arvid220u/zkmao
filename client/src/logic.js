// logic.js is intended to hold all game logic

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
// always assume broadcast messages!!!!!!
// 1. setup:
//  1.1 everyone: READY hashOfRandomNumber userID (number is a 64-bit integers, user id is randomly generated (later should be public key))
//  1.2 when everyone you have open connections with say READY: START randomNumber  (userID is sent with every message)
//  1.3 when received all STARTs: verifies all hashes, xors all numbers, seed rng with this, then just pick cards
//  1.4 using same seed just choose order
// 2. play:
//  2.1 someone: PLAY card userID publicGameStateAfter
//  2.2 everyone else: PLAYACK card fromUser userID publicGameStateAfter
// 3. abort:
//  3.1 send ABORT userID to every user, be sad

// ok dont overthink it
// i think having a hierarchical state thing makes sense
// this is javascript not rust

// ok so we have:
// phase = {"setup", "play", "gameover", "abort"}
// each phase has some metadata, which can be public or private
// the public metadata is always sent over for debugging purposes

// transitions
// setup:
//      state = {"preReady","sentReady","sentStart"},
//      players, readyHashes, startNumbers
//
// play:
//      nextTurn = user_id
//      public: players (order matters), playedCards (0 bottom, n-1 top), playerHands (id -> array)
//          invariant: union is good, disjoint
//
// gameover: (transitions directly to setup.sentReady)
//      winner = user_id
//
// abort:
//      (no data)

const PHASES = {
  SETUP: "SETUP",
  PLAY: "PLAY",
  GAMEOVER: "GAMEOVER",
  ABORT: "ABORT",
};
const SETUP_STATES = {
  PRE_READY: "PRE_READY",
  SENT_READY: "SENT_READY",
  SENT_START: "SENT_START",
};

export function createGame() {
  // TODO: generate private/public keypair here and let userId be the public key
  let userId = Math.random().toString(36).substr(2, 9);
  let game = {
    phase: PHASES.SETUP,
    userId: userId,
    state: SETUP_STATES.PRE_READY,
    players: [userId],
    readyHashes: [],
    startNumbers: [],
  };
  return game;
}
