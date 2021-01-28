include "../node_modules/circomlib/circuits/comparators.circom"
include "../node_modules/circomlib/circuits/mimcsponge.circom"
include "../modulo/libcircuit.circom"
include "../accessBitMao10/libcircuit.circom"
include "../accessBitMao20/libcircuit.circom"
template MaoRule(numInts){
    // rules are function from ( [2] x [53] x [53] ), they are represrented by 30 integers
    //each integer stores 200 bits, each bit is the value of the rule on an input
    signal private input rule[numInts];
    signal input ruleHash; //"MIMC(rule) === ruleHash"
    signal input gameState[3]; // 1st integer: 0 or 1 (whether it is last card)
                                // 2nd, 3rd integer: between 0 and 52 (52 cards + empty hand)
    
    signal input userAction; // a boolean indicating whether the user acted on the rule

    signal output correctBehavior;  // a boolean indicating whether the behaviour was correct

    //determining which bit to accessBucket

    signal bitNumber <== gameState[0] + 2 * gameState[1] + 2 * 53 * gameState[2]
    signal numBitsPerInteger <== 200;
    component dev1 = Modulo(100); // TODO: change this magic number!!!!
    dev1.n <== bitNumber;
    dev1.m <== numBitsPerInteger;
    signal integerBin <== dev1.quotient;
    signal bitInInteger <== dev1.remainder;

    component dev2 = Modulo(100);
    dev2.n <== bitInInteger;
    dev2.m <== 10;
    signal smallBucket <== dev2.quotient;
    signal locInBucket <== dev2.remainder;

    //Accessing the integer
    signal temp[numInts + 1];
    temp[0] <== 0; 
    for (var ii = 0; ii < numInts; ii++) {
        component eq_ii = IsEqual();
        eq_ii.in[0] <== ii;
        eq_ii.in[1] <== integerBin;
        temp[ii+1] <== temp[ii] + eq_ii.out * rule[ii];
    }

    signal targetInteger <== temp[numInts];
    
    //Accessing the small bucket
    component accessBucket =  AccessBit20(20, 1024); //1024 = 2^10
    accessBucket.idx <== smallBucket;
    accessBucket.number <== targetInteger;
    signal bucket <== accessBucket.bit;
    //Acessing the bit
    component accessBit =  AccessBit10(10, 2);
    accessBit.idx <== locInBucket;
    accessBit.number <== bucket;
    signal bit <== accessBit.bit;

    //check if the bit is correct
    
    component eq = IsEqual();
    eq.in[0] <== bit;
    eq.in[1] <== userAction;
    correctBehavior <== eq.out;

    // Making sure the rule is compatible with its hash
    component mimcRule = MiMCSponge(numInts, 220, 1);
    mimcRule.k <== 0;
    for(var ii = 0; ii < numInts; ii ++){
        mimcRule.ins[ii] <== rule[ii];
    }
    ruleHash === mimcRule.outs[0];
}

component main = MaoRule(30);