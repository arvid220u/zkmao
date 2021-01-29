import assert from "./assert.js";

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
    tokenHash: {},
    myTokens: initialTokens(),
  };
  for (const user of players) {
    tokenState.tokenHash[user] = tokenNumToHash(
      tokenListToNum(initialTokens())
    );
  }
  return tokenState;
}

function initialTokens() {
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
export async function draw(tokenState) {
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
//   if everything correct:
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
//   if everything correct:
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
