
template DrawCards() {
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

    signal drawRemainder;
    signal drawQuotient;
    drawRemainder <-- drawHash % 6;
    drawQuotient <-- (drawHash - drawRemainder) / 6;
    //should enforce that remainder is bounded
    drawHash === 6 * drawQuotient + drawRemainder;
    component quotientBound = LessThan(4);
    quotientBound.in[0] <== drawQuotient;
    // quotient < floor(32 / 6) + 1
    quotientBound.in[1] <== 6;
    quotientBound.out === 1;
    d === drawRemainder + 1;
}

component main = DrawCards();