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

  return [1, 1, 1, 1, 1, 1];
}
// TODO: implement this
async function hashCompiledSource(compiled) {
  // should hash in the same way as the snark is doing
  return await utils.hash(JSON.stringify(compiled));
}
