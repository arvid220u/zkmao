// NOTE: this file should be the exact same as drawcards/circuit.circom
// this is to run privately so you can get the correct values for the newCardstate and newNumCardsInDeck


include "../../node_modules/circomlib/circuits/mimcsponge.circom"
include "../../node_modules/circomlib/circuits/comparators.circom"
include "../random/libcircuit.circom"
include "../modulo/libcircuit.circom"
include "../ithk/libcircuit.circom"
include "../exponentiate/libcircuit.circom"

// 0: deck, 1: hand, 2: discarded
template DrawCardsPublicly(numCards) {
    signal input oldCardstate;
    signal input oldNumCardsInDeck;
    signal input seed;

    signal input drawSalt;

    signal output newCardstate;
    signal output newNumCardsInDeck;

    // check that we actually have a card to draw from
    component le = LessThan(100);
    le.in[0] <== 0;
    le.in[1] <== oldNumCardsInDeck;
    le.out === 1;


    /* prove drawn card is correct */
    component mimcDraw = MiMCSponge(2, 220, 1);
    mimcDraw.ins[0] <== seed;
    mimcDraw.ins[1] <== drawSalt;
    mimcDraw.k <== 0;
    component drawHashBits = Num2Bits(254);
    drawHashBits.in <== mimcDraw.outs[0];
    signal drawHash;
    drawHash <== drawHashBits.out[4] * 16 + drawHashBits.out[3] * 8 + drawHashBits.out[2] * 4 + drawHashBits.out[1] * 2 + drawHashBits.out[0];

    component rand = Random();
    rand.n <== oldNumCardsInDeck;
    rand.randomSource <== drawHash;
    signal chosenDeckIndex <== rand.out;

    // our numbers are trinary, and a deck card is indicated by a 0
    // the max number of digits is numCards
    component ith3 = IthK(3, 0, numCards)
    ith3.i <== chosenDeckIndex;
    ith3.n <== oldCardstate;
    signal chosenCard <== ith3.j;

    // now exponentiate this card
    component exp = Exponentiate(3, numCards)
    exp.exponent <== chosenCard;
    signal chosenCardValue <== exp.answer;

    newCardstate <== oldCardstate + chosenCardValue;
    newNumCardsInDeck <== oldNumCardsInDeck - 1;
}

