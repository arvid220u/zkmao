# zkmao

**play the game**: https://zkmao.xyz

zkmao is a fully peer-to-peer, trustless and uncheatable implementation of [the game of mao](https://en.wikipedia.org/wiki/Mao_(card_game)).

## overview

there are two main technologies that makes enables zkmao to be what it is:

1. [webrtc](https://en.wikipedia.org/wiki/WebRTC). the javascript client connects directly to another javascript client, bypassing servers. by using the manual signalling mode of webrtc, zkmao in fact depends on no servers at all — there is no third-party who can go down, be bribed, or steal your personal rules.
2. [zksnarks](https://z.cash/technology/zksnarks/). zksnarks is used in two places in zkmao: for enabling a private, provably random token system, and for enabling the provably consistent enforcing of rules without revealing them. the first use-case is arguably not completely justified (zksnarks enable the tokens to be private, but in the current design of the game it is not obvious that we gained much by making the tokens private). the second use-case is more clearly justified — while one could imagine a commit-reveal scheme for enforcing rules fairly and consistently, such a scheme inevitably needs a reveal phase, which is very undesirable in the game of mao!

## how to play zkmao

1. the goal is to get rid of your cards
2. you may only play a card if it is of either the same suit or the same rank as the previous card
3. there are secret rules — if you don't follow them, you will be penalized
4. after each game, players will be rewarded with tokens. you can spend tokens to create your own personal rule, enforcing penalties on others without revealing your rule

# dev

the folder structure is as follows:

- `client`: the web client, in React, using `create-react-app`, which contains all the game logic and manages the p2p connections
- `circuits`: the [`snarkjs`](https://github.com/iden3/snarkjs) circuits that are used in the client to prove things
- `powersoftau`: supporting files for generating the `.ptau` files used in the ZK proofs

## setup

run

```
npm install
```

in both the `client` and the `circuits` directories.

## `client`

the codebase is... perhaps not the world's prettiest :). most game logic is in `src/logic.js`. note that great care is needed to make sure that the asynchronous p2p communication does not have subtle bugs, and equally great care is needed to make sure that the snarks and all their public signals are fully verified. it is a somewhat fragile system.

## `circuits`

each circuit is in its own subfolder. there are a ton of scripts at the top level for compiling circuits and resolving `snarkjs`-specific problems (such as `for` loops being broken; circumvented by manual unrolling using `unroll.sh`). the most important one is `deploy-circuits.sh`, which compiles all circuits and puts them into the `client` for use by the website. `debug.sh` is useful for debugging.

the main circuits are:
1. `drawcardsprivately`: this circuit allows us to simulate our concept of tokens in the game of mao. each player has a personal stock of tokens, of differing values. this circuit allows the player to provably randomly take a token from the stock and move it into their personal hand, for later use.
2. `playcards`: this circuit allows the player to consume a token, proving to their opponent that the token was previously in their hand.
3. `maorule`: this circuit allows for players to enforce their personal rules without revealing them.

the other circuits are used for supporting these main circuits.
