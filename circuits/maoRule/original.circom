include "../node_modules/circomlib/circuits/comparators.circom"
include "../node_modules/circomlib/circuits/mimcsponge.circom"
include "../modulo/libcircuit.circom"
include "../accessBit/libcircuit.circom"
template MaoRule(numInts){
    // rules are function from ( [2] x [53] x [53] ), they are represrented by 30 integers
    //each integer stores 200 bits, each bit is the value of the rule on an input
    signal private input rule[numInts];
    signal input ruleHash; //"MIMC(rule) === ruleHash"
    signal input gameState[3]; // 1st integer: 0 or 1 (whether it is last card)
                                // 2nd, 3rd integer: between 0 and 52 (52 cards + empty hand)
    
    signal input userAction; // a boolean indicating whether the user acted on the rule

    signal output correctBehavior;  // a boolean indicating whether the behaviour was correct

    //determining which bit to access

    signal bitNumber <== gameState[0] + 2 * gameState[1] + 2 * 53 * gameState[3]
    signal numBitsPerInteger <== 200;
    component dev = Modulo(100); // TODO: change this magic number!!!!
    dev.n <== bitNumber;
    dev.m <== numBitsPerInteger;
    signal integerStoringIt <== dev.quotient;
    signal bitInInteger <== dev.remainder;

    //Accessing the integer
    singal temp[numInts + 1];
    temp[0] <== 0; 
    for (var ii = 0; ii < numInts; ii++) {
        component eq_ii = IsEqual();
        eq_ii.in[0] <== ii;
        eq_ii.in[1] <== integerStoringIt;
        temp[ii+1] <== temp[ii] + eq_ii.out * rule[ii];
    }

    signal targetInteger <== temp[numInts];
    
    //Acessing the bit
    component access =  AccessBit(200, 2);
    access.idx <== bitInInteger;
    access.number <== targetInteger;
    signal bit <== access.bit;

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

component main = MaoRule();