import assert from "./assert.js";
import mimcHash from "./mimc.ts";
import * as snarks from "./snarks.js";
// we store a tokenState object.
// a tokenState object has the following:
//      1. tokenHashes: {userId -> tokenHash}
//      2. myTokens: list of token objects
//      3. tokenStats {userId -> {stock: n, hand: n, discarded: n}}
//
// a token is represented by: {tokenPower: n, state: }. tokenPower = # cards for penalty

// FIRST SALT ALWAYS HAS TO BE THE SAME!!!!!!

export const TOKEN_STATE = {
  STOCK: "STOCK", // 0
  HAND: "HAND", // 1
  DISCARDED: "DISCARDED", // 2
};
const TOKEN_STATES = [
  TOKEN_STATE.STOCK,
  TOKEN_STATE.HAND,
  TOKEN_STATE.DISCARDED,
];
const TOKEN_STATE_BIT = {
  [TOKEN_STATE.STOCK]: 0,
  [TOKEN_STATE.HAND]: 1,
  [TOKEN_STATE.DISCARDED]: 2,
};

// needs to be same as length of token states
const NUM_TOKEN_STATES = 3;

// important!! this needs to be the same as the generated snarks
const NUM_TOKENS = 10;

export function createTokenState(players) {
  const tokenState = {
    tokenHashes: {},
    myTokens: initialTokens(),
    tokenStats: {},
  };
  for (const user of players) {
    tokenState.tokenHashes[user] = tokenNumToHash(
      tokenListToNum(initialTokens())
    );
    tokenState.tokenStats[user] = {
      [TOKEN_STATE.STOCK]: NUM_TOKENS,
      [TOKEN_STATE.HAND]: 0,
      [TOKEN_STATE.DISCARDED]: 0,
    };
  }
  return tokenState;
}

export function initialTokens() {
  // this order determines the power
  const tokens = [
    { tokenPower: 3, state: TOKEN_STATE.STOCK, id: 0 }, // 3^0
    { tokenPower: 2, state: TOKEN_STATE.STOCK, id: 1 }, // 3^1
    { tokenPower: 1, state: TOKEN_STATE.STOCK, id: 2 }, // 3^2
    { tokenPower: 1, state: TOKEN_STATE.STOCK, id: 3 }, // 3^3
    { tokenPower: 1, state: TOKEN_STATE.STOCK, id: 4 }, // 3^4
    { tokenPower: 0, state: TOKEN_STATE.STOCK, id: 5 }, // 3^5
    { tokenPower: 0, state: TOKEN_STATE.STOCK, id: 6 }, // 3^6
    { tokenPower: 0, state: TOKEN_STATE.STOCK, id: 7 }, // 3^7
    { tokenPower: 0, state: TOKEN_STATE.STOCK, id: 8 }, // 3^8
    { tokenPower: 0, state: TOKEN_STATE.STOCK, id: 9 }, // 3^9
  ];
  assert(tokens.length === NUM_TOKENS, "tokens must be sameeeee");
  return tokens;
}

function tokenListToNum(tokens) {
  let num = 0;
  let pwr3 = 1;
  for (const token of tokens) {
    num += pwr3 * tokenStateToBit(token.state);
    pwr3 = pwr3 * NUM_TOKEN_STATES;
  }
  return num;
}
function tokenNumToList(tokenNum) {
  // reverse of tokenListToNum
  let num = tokenNum;
  let tokens = initialTokens();
  for (const token of tokens) {
    let bit = num % NUM_TOKEN_STATES;
    num = Math.floor(num / NUM_TOKEN_STATES);
    let tokenState = tokenBitToState(bit);
    token.state = tokenState;
  }
  assert(num === 0, "should be 0 lol");
  return tokens;
}
function tokenStateToBit(tokenState) {
  assert(Object.keys(TOKEN_STATE_BIT).includes(tokenState), "uh");
  return TOKEN_STATE_BIT[tokenState];
}
function tokenBitToState(tokenBit) {
  assert(0 <= tokenBit && tokenBit < NUM_TOKEN_STATES, "uh");
  return TOKEN_STATES[tokenBit];
}
function tokenNumToHash(tokenNum) {
  // TODO: hash this in the mimc way lol
  return 0;
}
export function tokenIdToPower(tokenId) {
  return initialTokens().filter((t) => t.id === tokenId)[0].tokenPower;
}

export function serializeTokens(tokens) {
  return tokens.map((t) => `${t.tokenPower}`).join(",");
}

export function awardFunction(numCards) {
  if (numCards === 0) {
    return 3;
  } else if (numCards === 1) {
    return 2;
  } else if (numCards < 5) {
    return 1;
  }
  return 0;
}

// this function takes a tokenState (see def top of this file)
// and it draws 1 card from the personal deck
// precondition is that there is at least 1 card in the personal deck
// it returns:
//  - {newTokenHash: , proof: }
// side effects:
//  - update tokenState.myTokens to reflect the newly drawn token
export async function draw(
  tokenState,
  salt1,
  salt2,
  seed,
  opponentRandomness,
  nonce,
  userId
) {
  const r = Math.floor(Math.random() * 10);
  tokenState.myTokens[r].state = TOKEN_STATE.HAND;
  return {
    newTokenHash: "blablablabla",
    proof: "snarkjs proof lolol",
  };
  let oldCardState = tokenListToNum(tokenState.myTokens);
  let hash1 = mimcHash(seed, opponentRandomness, nonce) % 32;
  let oldNumCardsInDeck = tokenState.tokenStats[userId]["stock"];
  let cardToPick = hash1 % oldNumCardsInDeck;
  let idToState = {};
  for (var token of tokenState.myTokens) {
    idToState[token.id] = token.state;
  }
  let answer = null;
  let counter = 0;
  for (var i = 0; i < tokenState.myTokens.length; i++) {
    if (idToState[i] === TOKEN_STATE.STOCK) {
      counter++;
    }
    if (counter - cardToPick === 1) {
      answer = i;
      break;
    }
  }
  let newCardState = oldCardState + 3 ** answer;
  let newNumCardsInDeck = oldNumCardsInDeck + 1;
  let oldCommit = mimcHash(oldCardState, oldNumCardsInDeck, salt1);
  let newCommit = mimcHash(newCardState, newNumCardsInDeck, salt2);
  let seedCommit = mimcHash(seed);

  let drawInput = {
    oldCardstate: `${oldCardState}`,
    oldNumCardsInDeck: `${oldNumCardsInDeck}`,
    newCardstate: `${newCardState}`,
    newNumCardsInDeck: `${newNumCardsInDeck}`,
    seed: `${seed}`,
    salt1: `${salt1}`,
    salt2: `${salt2}`,
    opponentRandomness: `${opponentRandomness}`,
    nonce: `${nonce}`,
  };
  console.log("expected public signal");
  console.log([seedCommit, oldCommit, newCommit, opponentRandomness, nonce]);
  console.log(
    await snarks.prove("drawcardsprivately", drawInput)["publicSignal"]
  );

  return {
    newTokenHash: "lol",
    proof: "this is supposed to be a snark proof lol",
  };
}

export const INCORRECTLY_DRAWN_TOKEN = "INCORRECTLY_DRAWN_TOKEN";
export const INCORRECTLY_PLAYED_TOKEN = "INCORRECTLY_PLAYED_TOKEN";

// input:
//      - tokenState (see top of this file)
//      - drawnToken (output of draw)
//      - user (the id of the user who drew the token)
// output:
//   if everything correct (need to check that tokenState.tokenHashes reflects the old hash value!):
//      - true
//   if incorrect proof:
//      - INCORRECTLY_DRAWN_TOKEN
// side effects:
//   if everything correct:
//      - update tokenState.tokenHashes to reflect the new hash
//      - update tokenState.tokenStats to reflect the newly drawn token
export async function verifyDrawnToken(tokenState, drawnToken, user) {
  return true;
}

// input:
//      - tokenState (see top of file)
//      - token (the token you want to play)
// output:
//     {newTokenHash: , proof: }
// side effects:
//    - update tokenState.myTokens to reflect the newly played token
export async function play(tokenState, token) {
  tokenState.myTokens.filter((t) => t.id === token.id)[0].state =
    TOKEN_STATE.DISCARDED;
  return {
    newTokenHash: "lol",
    proof: "this is supposed to be a snark proof lol",
  };
}

// input:
//      - tokenState (see top of this file)
//      - playedToken (output of play)
//      - tokenID (the id of the token being played)
//      - user (the id of the user who played the token)
// output:
//   if everything correct (including verifying that tokenID is indeed the input to playedToken!):
//      - true
//   if incorrect proof:
//      - INCORRECTLY_PLAYED_TOKEN
// side effects:
//   if everything correct:
//      - update tokenState.tokenHashes to reflect the new hash
//      - update tokenState.tokenStats to reflect the newly played token
export async function verifyPlayedToken(
  tokenState,
  playedToken,
  tokenID,
  user
) {
  return true;
}
