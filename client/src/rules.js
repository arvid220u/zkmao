// rules

import * as utils from "./utils.js";

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
    compiled: compileSource(source),
    hash: null,
  };
  rule.hash = await hashCompiledSource(rule.compiled);
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

// TODO: implement this
function compileSource(source) {
  console.log("compiling source:");
  console.log(source);
  utils.unimplemented();

  return [1, 1, 1, 1, 1, 1 * source.length];
}
// TODO: implement this
async function hashCompiledSource(compiled) {
  // should hash in the same way as the snark is doing
  return await utils.hash(JSON.stringify(compiled));
}

export function sameRule(r1, r2) {
  return r1.hash === r2.hash;
}

// input:
//  - card: the card that was played
//  - playedCards: the cards that have been played so far, not including `card`, 0 is oldest and n-1 is most recently played
//  - selectedRules: the rules that the player playing `card` selected
//  - myRules: the private rules (including source code) that we know of and want to check for
// output:
//  - a list `provedRules` of length myRules.length, such that provedRules[i] is an object on the form:
//      {rule: (publicrule object), proof: (snarkproof), penalty: (0 or 1)}
//    where `rule` is the public rule version of each rule in `myRules`
export function determinePenalties(card, playedCards, selectedRules, myRules) {
  // TODO: implement this

  return myRules.map((rule) => {
    return {
      rule: publicRule(rule),
      proof: "this is supposed to be a snark proof",
      penalty: 0,
    };
  });
}

export const INCORRECT_PENALTIES = "INCORRECT_PENALTIES";

// input:
//  - card: the card that was played
//  - playedCards: the cards that have been played so far, not including `card`, 0 is oldest and n-1 is most recently played
//  - selectedRules: the rules that the player playing `card` selected
//  - provedRules: the proof object outputted by determinePenalties
// output:
//  if all provedRules were correct:
//      - a list of all the publicrules that were violated
//  if anything is incorrect:
//      - INCORRECT_PENALTIES
export function verifyPenalties(card, playedCards, selectedRules, provedRules) {
  // TODO: implement this!!! this below is bullshit
  const violatedRules = [...selectedRules];
  console.log("VIOLATED RULES:");
  console.log(violatedRules);
  return violatedRules;
}
