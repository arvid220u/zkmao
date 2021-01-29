/* global BigInt */
// rules

import * as utils from "./utils.js";
import * as snarks from "./snarks.js";
import mimcHash from "./mimc.ts";
import { computeCardIndex } from "./cards.js";

// rule is a struct containing:
//  - name: name of the rule
//  - hash: hash of the compiled source code (same hash as within the snark)
//  if it is private, also contains:
//  - source: (the human readable source code written a cool language)
//  - compiled: (a list of integers which is the compiled version for the snark)
//  - owner: (the user id of the user owning the rule, or "everyone")

// the game will store:
//  - myRules: a list of my private rules
//  - allRules: a list of all known public rules
//  - rulesByOwner: a map {user -> ownedRule}. because if initial rules it is ok for multiple people to know the same rule

export const EVERYONE = "everyone";

export async function createPrivateRule(name, source, owner) {
  const rule = {
    name,
    source,
    owner,
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
  myRules
) {
  // TODO: implement this

  let rulesActedUpon = {};
  for (const rule in selectedRules) {
    rulesActedUpon[rule.hash] = rule;
  }
  let answer = [];
  for (const rule in myRules) {
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
    response["penalty"] = !response["proof"]["publicSignals"][
      response["proof"]["publicSignals"].length - 1
    ];
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
      : computeCardIndex(playedCards[playedCards.length]);
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
  for (const rule in selectedRules) {
    rulesActedUpon[rule.hash] = rule;
  }
  let answer = [];
  for (const proof in provedRules) {
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
  let card1 = computeCardIndex(card);
  let card2 =
    playedCards.length === 0
      ? 52
      : computeCardIndex(playedCards[playedCards.length]);
  let lastCard = hand.length === 1;
  return (
    publicSignals[0] === ruleHash &&
    publicSignals[1][0] === (lastCard ? 1 : 0) &&
    publicSignals[1][1] === card1 &&
    publicSignals[1][2] === card2 &&
    publicSignals[2] === (userAction ? 1 : 0)
  );
}
