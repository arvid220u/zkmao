include "../node_modules/circomlib/circuits/mimcsponge.circom"
include "../node_modules/circomlib/circuits/comparators.circom"
include "../drawcardspublicly/libcircuit.circom"

// 0: deck, 1: hand, 2: discarded
template DrawCardsPrivately(numCards) {
    signal private input oldCardstate;
    signal input oldNumCardsInDeck;
    signal private input newCardstate;
    signal input newNumCardsInDeck;
    signal input seed;
    signal private input salt1;
    signal private input salt2;

    signal input opponentRandomness;
    signal input nonce;

    signal output oldCommit;
    signal output newCommit;

    /* prove commits are correct */
    component mimcOld = MiMCSponge(3, 220, 1);
    mimcOld.ins[0] <== oldCardstate;
    mimcOld.ins[1] <== oldNumCardsInDeck;
    mimcOld.ins[2] <== salt1;
    mimcOld.k <== 0;
    oldCommit <== mimcOld.outs[0];

    component mimcNew = MiMCSponge(3, 220, 1);
    mimcNew.ins[0] <== newCardstate;
    mimcNew.ins[1] <== newNumCardsInDeck;
    mimcNew.ins[2] <== salt2;
    mimcNew.k <== 0;
    newCommit <== mimcNew.outs[0];

    /* prove cardstate is correct */
    component publicDraw = DrawCardsPublicly(numCards);
    publicDraw.oldCardstate <== oldCardstate;
    publicDraw.oldNumCardsInDeck <== oldNumCardsInDeck;
    publicDraw.seed <== seed;
    publicDraw.opponentRandomness <== opponentRandomness;
    publicDraw.nonce <== nonce;

    newCardstate === publicDraw.newCardstate;
    newNumCardsInDeck === publicDraw.newNumCardsInDeck;
}

component main = DrawCardsPrivately(10);
