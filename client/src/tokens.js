import assert from "./assert.js";
import mimcHash from "./mimc.ts";
import * as snarks from "./snarks.js";
import * as utils from "./utils.js";
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

export async function createTokenState(players) {
  const tokenState = {
    tokenHashes: {},
    myTokens: initialTokens(),
    tokenStats: {},
  };
  for (const user of players) {
    tokenState.tokenHashes[user] = await tokenNumToHash(
      tokenListToNum(initialTokens()),
      NUM_TOKENS,
      0
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
async function tokenNumToHash(tokenNum, numCards, salt) {
  // TODO: hash this in the mimc way lol
  return `${await mimcHash(tokenNum, numCards, salt)}`;
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

// input:
//      -tokenState (see def top of this file)
//      -salt1 (the salt used with the previous state commit)
//      -salt2 (the salt used this state commit)
//      -seed (the seed)
//      -opponentRandomness (the opponentRandomness)
//      -nonce (the number of the turn)
//      -userId (the Id of the owner of the card)
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
  let publicInput = {
    oldCardstate: `${tokenListToNum(tokenState.myTokens)}`,
    oldNumCardsInDeck: `${tokenState.tokenStats[userId][TOKEN_STATE.STOCK]}`,
    seed: `${seed}`,
    nonce: `${nonce}`,
    opponentRandomness: `${opponentRandomness}`,
  };

  let publicOutput = await snarks.prove(publicInput, "drawcardspublicly");
  publicOutput = publicOutput.publicSignals;
  let newCardState = publicOutput[0];
  let newNumCardsInDeck = publicOutput[1];

  let privateInput = { ...publicInput };
  privateInput["newCardstate"] = `${newCardState}`;
  privateInput["newNumCardsInDeck"] = `${newNumCardsInDeck}`;
  privateInput["salt1"] = `${salt1}`;
  privateInput["salt2"] = `${salt2}`;

  console.log(
    "qowierjfpoiqwejgfpowqejpoqwejfpoqwejfpioqwejfpoqwejfpoiqwefjpoiqwejf"
  );
  console.log(utils.objectify(privateInput));
  let privateOutput = await snarks.prove(privateInput, "drawcardsprivately");
  let newTokenHash = privateOutput["publicSignals"][1];
  let oldTokenHash = privateOutput["publicSignals"][0];
  assert(
    oldTokenHash === tokenState.tokenHashes[userId],
    "hashes should be same lolol"
  );
  console.log("SEEEEEEEEED: ");
  console.log(seed);
  console.log("SEEEEDCOMMITTTTT:");
  console.log(utils.objectify(privateOutput));
  console.log(oldTokenHash);
  console.log(tokenState.tokenHashes[userId]);
  console.log(utils.objectify(tokenState));

  //TODO update the tokenHash stuff
  let power = Math.round(
    Math.log(newCardState - publicInput["oldCardstate"]) / Math.log(3)
  );
  assert(
    tokenState.myTokens.filter((t) => t.id === power)[0].state ===
      TOKEN_STATE.STOCK,
    "this should ne with the player"
  );
  tokenState.myTokens.filter((t) => t.id === power)[0].state = TOKEN_STATE.HAND;
  return {
    newTokenHash: `${newTokenHash}`,
    proof: privateOutput,
  };
}

export const INCORRECTLY_DRAWN_TOKEN = "INCORRECTLY_DRAWN_TOKEN";

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
export async function verifyDrawnToken(
  tokenState,
  drawnToken,
  user,
  opponentRandomness,
  nonce,
  seed
) {
  //TODO assign the variables below
  let previousHash = tokenState.tokenHashes[user];
  //   let seedCommit = `${await mimcHash(seed)}`;
  let proof = drawnToken["proof"]; // a value in the object returned by the proof function
  let oldNumCardsInDeck = tokenState.tokenStats[user][TOKEN_STATE.STOCK];
  let newNumCardsInDeck = tokenState.tokenStats[user][TOKEN_STATE.STOCK] - 1;
  console.log(
    "HEEEEEEEEEEEEEEEEEEREEEEEEEEEEEEEEEEEEEEEEE\n\n\n\n\n\n\\n\n\n\n\\n\n\n\\n\n\n"
  );
  console.log(proof["publicSignals"][0]);
  console.log(previousHash);
  console.log(proof["publicSignals"]);
  console.log(
    "HEEEEEEEEEEEEEEEEEEREEEEEEEEEEEEEEEEEEEEEEE\n\n\n\n\n\n\\n\n\n\n\\n\n\n\\n\n\n"
  );
  console.log("SEEEEEEEEED: ");
  console.log(seed);

  //check that stuff make sense
  if (proof["publicSignals"][0] !== previousHash) {
    console.log("Oh noo");
    console.log(1);
    // console.log(seedCommit);
    // console.log(seedCommit !== proof["publicSignals"][0]);
    console.log(proof["publicSignals"][0] !== previousHash);

    return INCORRECTLY_DRAWN_TOKEN;
  }

  //check that public paramaters are good
  if (
    `${oldNumCardsInDeck}` !== proof["publicSignals"][2] ||
    `${newNumCardsInDeck}` !== proof["publicSignals"][3] ||
    `${seed}` !== proof["publicSignals"][4] ||
    `${opponentRandomness}` !== proof["publicSignals"][5] ||
    `${nonce}` !== proof["publicSignals"][6]
  ) {
    console.log("Oh noooo");
    console.log(2);
    console.log(oldNumCardsInDeck !== proof["publicSignals"][2]);
    console.log(newNumCardsInDeck !== proof["publicSignals"][3]);
    console.log(opponentRandomness !== proof["publicSignals"][4]);
    console.log(nonce !== proof["publicSignals"][5]);
    return INCORRECTLY_DRAWN_TOKEN;
  }
  //check the proof
  let verification = await snarks.verify(
    "drawcardsprivately",
    proof["publicSignals"],
    proof["proof"]
  );

  //TODO figure side effects out
  let newHash = proof["publicSignals"][1]; //TODO store this somewhere
  tokenState.tokenHashes[user] = newHash;
  tokenState.tokenStats[user][TOKEN_STATE.STOCK]--;
  tokenState.tokenStats[user][TOKEN_STATE.HAND]++;

  return verification ? true : INCORRECTLY_DRAWN_TOKEN;
}

// input:
//      - tokenState (see top of file)
//      - token (the token you want to play)
//      -salt1 (the salt used with the previous state commit)
//      -salt2 (the salt used this state commit)
//      -userId (the Id of the owner of the card)
// output:
//     {newTokenHash: , proof: }
// side effects:
//    - update tokenState.myTokens to reflect the newly played token
export async function play(tokenState, token, salt1, salt2, userID) {
  let input = {
    cardNumber: `${token.id}`,
    oldCardState: `${tokenListToNum(tokenState.myTokens)}`,
    newCardState: `${tokenListToNum(tokenState.myTokens) + 3 ** token.id}`,
    oldNumCardsInDeck: `${tokenState.tokenStats[userID][TOKEN_STATE.STOCK]}`,
    newNumCardsInDeck: `${tokenState.tokenStats[userID][TOKEN_STATE.STOCK]}`,
    salt1: `${salt1}`,
    salt2: `${salt2}`,
  };
  let proof = await snarks.prove(input, "playCard");
  assert(
    tokenState.myTokens.filter((tok) => tok.id === token.id)[0].state ===
      TOKEN_STATE.HAND,
    "card should be in hand@@@@@@bbbbbb"
  );
  tokenState.myTokens.filter((tok) => tok.id === token.id)[0].state =
    TOKEN_STATE.DISCARDED;
  return {
    newTokenHash: proof["publicSignals"][1],
    proof: proof,
  };
}

export const INCORRECTLY_PLAYED_TOKEN = "INCORRECTLY_PLAYED_TOKEN";
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
  //TODO assign the variables below
  let oldNumCardsInDeck = tokenState.tokenStats[user][TOKEN_STATE.STOCK];
  let newNumCardsInDeck = tokenState.tokenStats[user][TOKEN_STATE.STOCK];
  let previousHash = tokenState.tokenHashes[user];
  let proof = playedToken["proof"]; // a value in the object returned by the proof function

  //check that stuff make sense
  if (
    proof["publicSignals"][0] !== previousHash ||
    proof["publicSignals"][2] !== `${tokenID}`
  ) {
    return INCORRECTLY_PLAYED_TOKEN;
  }

  //check that public paramaters are good
  if (
    `${oldNumCardsInDeck}` !== proof["publicSignals"][3] ||
    `${newNumCardsInDeck}` !== proof["publicSignals"][4]
  ) {
    return INCORRECTLY_PLAYED_TOKEN;
  }
  //check the proof
  let verification = await snarks.verify(
    "playCard",
    proof["publicSignals"],
    proof["proof"]
  );

  let newHash = proof["publicSignals"][1];
  tokenState.tokenHashes[user] = newHash;
  tokenState.tokenStats[user][TOKEN_STATE.HAND]--;
  tokenState.tokenStats[user][TOKEN_STATE.DISCARDED]++;

  return verification ? true : INCORRECTLY_PLAYED_TOKEN;
}
