
// 0: deck, 1: hand, 2: discarded
template DrawCards(numCards) {
    signal private input oldCardstate;
    signal private input oldNumCardsInDeck;
    signal private input newCardstate;
    signal private input seed;
    signal private input salt1;
    signal private input salt2;

    signal input drawSalt;
    
    signal output seedCommit;
    signal output oldCommit;
    signal output newCommit;

    /* prove commits are correct */
    component mimcSeed = MiMCSponge(1, 220, 1);
    mimcSeed.ins[0] <== seed;
    mimcSeed.k <== 0;
    seedCommit <== mimcSeed.outs[0];

    component mimcOld = MiMCSponge(2, 220, 1);
    mimcOld.ins[0] <== oldCardstate;
    mimcOld.ins[1] <== oldNumCardsInDeck;
    mimcOld.k <== 0;
    oldCommit <== mimcOld.outs[0];

    component mimcNew = MiMCSponge(1, 220, 1);
    mimcNew.ins[0] <== newCardstate;
    mimcNew.k <== 0;
    newCommit <== mimcNew.outs[0];

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

    newCardstate === oldCardstate + chosenCardValue;
}

component main = DrawCards(10);