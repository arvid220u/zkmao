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
    
        component eq_0 = IsEqual();
        eq_0.in[0] <== 0;
        eq_0.in[1] <== integerBin;
        temp[0+1] <== temp[0] + eq_0.out * rule[0];
    
        component eq_1 = IsEqual();
        eq_1.in[0] <== 1;
        eq_1.in[1] <== integerBin;
        temp[1+1] <== temp[1] + eq_1.out * rule[1];
    
        component eq_2 = IsEqual();
        eq_2.in[0] <== 2;
        eq_2.in[1] <== integerBin;
        temp[2+1] <== temp[2] + eq_2.out * rule[2];
    
        component eq_3 = IsEqual();
        eq_3.in[0] <== 3;
        eq_3.in[1] <== integerBin;
        temp[3+1] <== temp[3] + eq_3.out * rule[3];
    
        component eq_4 = IsEqual();
        eq_4.in[0] <== 4;
        eq_4.in[1] <== integerBin;
        temp[4+1] <== temp[4] + eq_4.out * rule[4];
    
        component eq_5 = IsEqual();
        eq_5.in[0] <== 5;
        eq_5.in[1] <== integerBin;
        temp[5+1] <== temp[5] + eq_5.out * rule[5];
    
        component eq_6 = IsEqual();
        eq_6.in[0] <== 6;
        eq_6.in[1] <== integerBin;
        temp[6+1] <== temp[6] + eq_6.out * rule[6];
    
        component eq_7 = IsEqual();
        eq_7.in[0] <== 7;
        eq_7.in[1] <== integerBin;
        temp[7+1] <== temp[7] + eq_7.out * rule[7];
    
        component eq_8 = IsEqual();
        eq_8.in[0] <== 8;
        eq_8.in[1] <== integerBin;
        temp[8+1] <== temp[8] + eq_8.out * rule[8];
    
        component eq_9 = IsEqual();
        eq_9.in[0] <== 9;
        eq_9.in[1] <== integerBin;
        temp[9+1] <== temp[9] + eq_9.out * rule[9];
    
        component eq_10 = IsEqual();
        eq_10.in[0] <== 10;
        eq_10.in[1] <== integerBin;
        temp[10+1] <== temp[10] + eq_10.out * rule[10];
    
        component eq_11 = IsEqual();
        eq_11.in[0] <== 11;
        eq_11.in[1] <== integerBin;
        temp[11+1] <== temp[11] + eq_11.out * rule[11];
    
        component eq_12 = IsEqual();
        eq_12.in[0] <== 12;
        eq_12.in[1] <== integerBin;
        temp[12+1] <== temp[12] + eq_12.out * rule[12];
    
        component eq_13 = IsEqual();
        eq_13.in[0] <== 13;
        eq_13.in[1] <== integerBin;
        temp[13+1] <== temp[13] + eq_13.out * rule[13];
    
        component eq_14 = IsEqual();
        eq_14.in[0] <== 14;
        eq_14.in[1] <== integerBin;
        temp[14+1] <== temp[14] + eq_14.out * rule[14];
    
        component eq_15 = IsEqual();
        eq_15.in[0] <== 15;
        eq_15.in[1] <== integerBin;
        temp[15+1] <== temp[15] + eq_15.out * rule[15];
    
        component eq_16 = IsEqual();
        eq_16.in[0] <== 16;
        eq_16.in[1] <== integerBin;
        temp[16+1] <== temp[16] + eq_16.out * rule[16];
    
        component eq_17 = IsEqual();
        eq_17.in[0] <== 17;
        eq_17.in[1] <== integerBin;
        temp[17+1] <== temp[17] + eq_17.out * rule[17];
    
        component eq_18 = IsEqual();
        eq_18.in[0] <== 18;
        eq_18.in[1] <== integerBin;
        temp[18+1] <== temp[18] + eq_18.out * rule[18];
    
        component eq_19 = IsEqual();
        eq_19.in[0] <== 19;
        eq_19.in[1] <== integerBin;
        temp[19+1] <== temp[19] + eq_19.out * rule[19];
    
        component eq_20 = IsEqual();
        eq_20.in[0] <== 20;
        eq_20.in[1] <== integerBin;
        temp[20+1] <== temp[20] + eq_20.out * rule[20];
    
        component eq_21 = IsEqual();
        eq_21.in[0] <== 21;
        eq_21.in[1] <== integerBin;
        temp[21+1] <== temp[21] + eq_21.out * rule[21];
    
        component eq_22 = IsEqual();
        eq_22.in[0] <== 22;
        eq_22.in[1] <== integerBin;
        temp[22+1] <== temp[22] + eq_22.out * rule[22];
    
        component eq_23 = IsEqual();
        eq_23.in[0] <== 23;
        eq_23.in[1] <== integerBin;
        temp[23+1] <== temp[23] + eq_23.out * rule[23];
    
        component eq_24 = IsEqual();
        eq_24.in[0] <== 24;
        eq_24.in[1] <== integerBin;
        temp[24+1] <== temp[24] + eq_24.out * rule[24];
    
        component eq_25 = IsEqual();
        eq_25.in[0] <== 25;
        eq_25.in[1] <== integerBin;
        temp[25+1] <== temp[25] + eq_25.out * rule[25];
    
        component eq_26 = IsEqual();
        eq_26.in[0] <== 26;
        eq_26.in[1] <== integerBin;
        temp[26+1] <== temp[26] + eq_26.out * rule[26];
    
        component eq_27 = IsEqual();
        eq_27.in[0] <== 27;
        eq_27.in[1] <== integerBin;
        temp[27+1] <== temp[27] + eq_27.out * rule[27];
    
        component eq_28 = IsEqual();
        eq_28.in[0] <== 28;
        eq_28.in[1] <== integerBin;
        temp[28+1] <== temp[28] + eq_28.out * rule[28];
    
        component eq_29 = IsEqual();
        eq_29.in[0] <== 29;
        eq_29.in[1] <== integerBin;
        temp[29+1] <== temp[29] + eq_29.out * rule[29];
    

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