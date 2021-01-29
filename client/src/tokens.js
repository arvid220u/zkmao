import assert from "./assert.js";

// we store a tokenState object.
// a tokenState object has the following:
//      1. tokenHashes: {userId -> tokenHash}
//      2. myTokens:
//
// a token is represented by: {tokenPower: n, state: }. tokenPower = # cards for penalty

// FIRST SALT ALWAYS HAS TO BE THE SAME!!!!!!

const TOKEN_STATE = {
  STOCK: "STOCK", // 0
  HAND: "HAND", // 1
  DISCARDED: "DISCARDED", // 2
};
const TOKEN_STATES = [
  TOKEN_STATE.STOCK,
  TOKEN_STATE.HAND,
  TOKEN_STATE.DISCARDED,
];
const TOKEN_STATE_NUM = {
  [TOKEN_STATE.STOCK]: 0,
  [TOKEN_STATE.HAND]: 1,
  [TOKEN_STATE.DISCARDED]: 2,
};

// important!! this needs to be the same as the generated snarks
const NUM_TOKENS = 6;

// TODO: is this correct??
const ALL_TOKENS_IN_STOCK = 0;

export function createTokenState(players) {
  const tokenState = {
    tokenHash: {},
    myTokens = initialTokens(),
  };
  for (const user of players) {
    tokenState.tokenHash[user] = tokenNumToHash(
      tokenListToNum(initialTokens())
    );
  }
}

function initialTokens() {
  // this order determines the power
  tokens = [
    { tokenPower: 3, state: TOKEN_STATE.STOCK }, // 3^0
    { tokenPower: 2, state: TOKEN_STATE.STOCK }, // 3^1
    { tokenPower: 1, state: TOKEN_STATE.STOCK }, // 3^2
    { tokenPower: 1, state: TOKEN_STATE.STOCK }, // 3^3
    { tokenPower: 1, state: TOKEN_STATE.STOCK }, // 3^4
    { tokenPower: 0, state: TOKEN_STATE.STOCK }, // 3^5
  ];
  assert(tokens.length === NUM_TOKENS, "tokens must be sameeeee");
  return tokens;
}

function tokenListToNum(tokens) {
  let num = 0;
  let pwr3 = 1;
  for (const token of tokens) {
    num += pwr3 * tokenStateToNum(token.state);
    pwr3 = pwr3 * 3;
  }
}
function tokenStateToNum(tokenState) {
  assert(Object.keys(TOKEN_STATE_NUM).includes(tokenState), "uh");
  return TOKEN_STATE_NUM[tokenState];
}
function tokenNumToHash(tokenNum) {
  // TODO: hash this in the mimc way lol
  return 0;
}
