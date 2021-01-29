/* global BigInt */
// rules

import * as utils from "./utils.js";
import * as snarks from "./snarks.js";
import mimcHash from "./mimc.ts";
import { computeCardIndex } from "./cards.js";

// rule is a struct containing:
//  - name: name of the rule
//  - hash: hash of the compiled source code (same hash as within the snark)
//  - owner: (the user id of the user owning the rule, or "everyone")
//  - penalty: (int, the # cards to penalize with)
//  if it is private, also contains:
//  - source: (the human readable source code written a cool language)
//  - compiled: (a list of integers which is the compiled version for the snark)

// the game will store:
//  - myRules: a list of my private rules
//  - allRules: a list of all known public rules
//  - rulesByOwner: a map {user -> ownedRule}. because if initial rules it is ok for multiple people to know the same rule

export const EVERYONE = "everyone";

export async function createPrivateRule(name, source, owner, penalty) {
  const rule = {
    name,
    source,
    owner,
    penalty,
    compiled: await compileSource(source),
    hash: null,
  };
  rule.hash = `${await mimcHash(...rule.compiled)}`;
  return rule;
}
export function publicRule(rule) {
  // strip out the private parts of this rule, before publishing it to anyone else
  const publicRule = {
    name: rule.name,
    owner: rule.owner,
    hash: rule.hash,
    penalty: rule.penalty,
  };
  return publicRule;
}

async function compileSource(source) {
  console.log("compiling source:");
  console.log(source);
  return await utils.compileUserRule(source);
}

export function sameRule(r1, r2) {
  return r1.hash === r2.hash;
}

// input:
//  - card: the card that was played
//  - playedCards: the cards that have been played so far, not including `card`, 0 is oldest and n-1 is most recently played
//  - the Hand of the player who is being checked, DOES NOT INCLUDE card
//  - selectedRules: the rules that the player playing `card` selected
//  - myRules: the private rules (including source code) that we know of and want to check for
// output:
//  - a list `provedRules` of length myRules.length, such that provedRules[i] is an object on the form:
//      {rule: (publicrule object), proof: (snarkproof), penalty: (0 or 1)}
//    where `rule` is the public rule version of each rule in `myRules`
export async function determinePenalties(
  card,
  playedCards,
  hand,
  selectedRules,
  myRules,
  reportStatus
) {
  let rulesActedUpon = {};
  for (let rule of selectedRules) {
    rulesActedUpon[rule.hash] = rule;
  }
  let answer = [];
  for (let [index, rule] of myRules.entries()) {
    let status = `verifying ${rule.name}; rule ${index} of ${myRules.length}.`;
    reportStatus(status);
    let snarkInput = await computeSnarkProveInput(
      card,
      playedCards,
      hand,
      rule,
      rule.hash in rulesActedUpon
    );
    let response = {};
    response["proof"] = await snarks.prove(snarkInput, "maoRule");
    response["rule"] = publicRule(rule);
    response["penalty"] = response["proof"]["publicSignals"][0] === "0";
    answer.push(response);
  }
  return answer;
}
async function computeSnarkProveInput(
  card,
  playedCards,
  hand,
  rule,
  userAction
) {
  let card1 = computeCardIndex(card);
  let card2 =
    playedCards.length === 0
      ? 52
      : computeCardIndex(playedCards[playedCards.length - 1]);
  let lastCard = hand.length === 1;
  let hash = rule.hash;
  let src = rule.compiled;
  let gameState = [lastCard, card1, card2];
  return {
    rule: src,
    ruleHash: hash,
    gameState: gameState,
    userAction: userAction,
  };
}

export const INCORRECT_PENALTIES = "INCORRECT_PENALTIES";

// input:
//  - card: the card that was played
//  - playedCards: the cards that have been played so far, not including `card`, 0 is oldest and n-1 is most recently played
//  - the Hand of the player who is being checked, DOES NOT INCLUDE card
//  - selectedRules: the rules that the player playing `card` selected
//  - provedRules: the proof object outputted by determinePenalties
// output:
//  if all provedRules were correct:
//      - a list of all the publicrules that were violated
//  if anything is incorrect:
//      - INCORRECT_PENALTIES
export async function verifyPenalties(
  card,
  playedCards,
  hand,
  selectedRules,
  provedRules
) {
  let rulesActedUpon = {};
  for (const rule of selectedRules) {
    rulesActedUpon[rule.hash] = rule;
  }
  let answer = [];
  for (const proof of provedRules) {
    if (
      !(await verifyPublicSignals(
        proof["proof"]["publicSignals"],
        card,
        playedCards,
        hand,
        proof["rule"].hash in rulesActedUpon,
        proof["rule"].hash
      )) ||
      !(await snarks.verify(
        "maoRule",
        proof["proof"]["publicSignals"],
        proof["proof"]["proof"]
      ))
    ) {
      return INCORRECT_PENALTIES;
    }
    if (proof["penalty"]) {
      answer.push(proof["rule"]);
    }
  }
  return answer;
}

async function verifyPublicSignals(
  publicSignals,
  card,
  playedCards,
  hand,
  userAction,
  ruleHash
) {
  let card1 = `${computeCardIndex(card)}`;
  let card2 =
    playedCards.length === 0
      ? "52"
      : `${computeCardIndex(playedCards[playedCards.length - 1])}`;
  let lastCard = hand.length === 1;
  console.log(publicSignals[1] === ruleHash);
  console.log(publicSignals[2] === (lastCard ? "1" : "0"));
  console.log(publicSignals[3] === card1);
  console.log(publicSignals[4] === card2);
  console.log(publicSignals[5] === (userAction ? "1" : "0"));
  return (
    publicSignals[1] === ruleHash &&
    publicSignals[2] === (lastCard ? "1" : "0") &&
    publicSignals[3] === card1 &&
    publicSignals[4] === card2 &&
    publicSignals[5] === (userAction ? "1" : "0")
  );
}
