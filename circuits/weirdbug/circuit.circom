include "../../node_modules/circomlib/circuits/mimcsponge.circom"
include "../../node_modules/circomlib/circuits/comparators.circom"

// template DrawCards() {
//     signal private input oldCardstate;
//     signal private input newCardstate;
//     signal private input seed;
//     signal private input salt1;
//     signal private input salt2;

//     signal input drawSalt;
    
//     signal output seedCommit;
//     signal output oldCommit;
//     signal output newCommit;

//     /* prove commits are correct */
//     component mimcSeed = MiMCSponge(1, 220, 1);
//     mimcSeed.ins[0] <== seed;
//     mimcSeed.k <== 0;
//     seedCommit <== mimcSeed.outs[0];

//     component mimcOld = MiMCSponge(1, 220, 1);
//     mimcOld.ins[0] <== oldCardstate;
//     mimcOld.k <== 0;
//     oldCommit <== mimcOld.outs[0];

//     component mimcNew = MiMCSponge(1, 220, 1);
//     mimcNew.ins[0] <== newCardstate;
//     mimcNew.k <== 0;
//     newCommit <== mimcNew.outs[0];

//     /* prove drawn card is correct */
//     component mimcDraw = MiMCSponge(2, 220, 1);
//     mimcDraw.ins[0] <== seed;
//     mimcDraw.ins[1] <== drawSalt;
//     mimcDraw.k <== 0;
//     component drawHashBits = Num2Bits(254);
//     drawHashBits.in <== mimcDraw.outs[0];
//     signal drawHash;
//     drawHash <== drawHashBits.out[4] * 16 + drawHashBits.out[3] * 8 + drawHashBits.out[2] * 4 + drawHashBits.out[1] * 2 + drawHashBits.out[0];

//     signal drawRemainder;
//     signal drawQuotient;
//     drawRemainder <-- drawHash % 6;
//     drawQuotient <-- (drawHash - drawRemainder) / 6;
//     //should enforce that remainder is bounded
//     drawHash === 6 * drawQuotient + drawRemainder;
//     component quotientBound = LessThan(4);
//     quotientBound.in[0] <== drawQuotient;
//     // quotient < floor(32 / 6) + 1
//     quotientBound.in[1] <== 6;
//     quotientBound.out === 1;
//     d === drawRemainder + 1;
// }
// template Exp(base, maxExp){
//     signal private input exponent;
//     signal output answer;

//     signal series[maxExp+1];
//     series[0] <== 1;
//     for (var i = 0; i < maxExp; i++){
//         series[i+1] <== series[i] * base;
//     }
//     // signal series;
//     // for (var i = 0; i < 1; i++){
//     //     series <== exponent;
//     // }

//     signal outseries[maxExp+2];
//     outseries[0] <== 0;
//     signal diff[maxExp+1];
//     signal eq[maxExp+1];
//     signal inv[maxExp+1];
//     for (var i = 0; i < maxExp+1; i++){
//         // component eq = IsEqual();
//         // eq.in[0] <== exponent;
//         // eq.in[1] <== i;
//         diff[i] <== exponent - i;
//         inv[i] <-- diff[i]!=0 ? 1/diff[i] : 0;
//         // eq <== -diff*inv +1;
//         // diff*eq === 0;
//         // outseries[i+1] <== outseries[i] + series[i] * eq;
//         outseries[i+1] <== outseries[i] + series[i] * diff[i];
//     }
//         // diff[0] <== exponent - 0;
//         // inv[0] <-- diff[0]!=0 ? 1/diff[0] : 0;
//         // // eq <== -diff*inv +1;
//         // // diff*eq === 0;
//         // // outseries[i+1] <== outseries[i] + series[i] * eq;
//         // outseries[0+1] <== outseries[0] + series[0] * diff[0];
//         // diff[1] <== exponent - 1;
//         // inv[1] <-- diff[1]!=0 ? 1/diff[1] : 0;
//         // // eq <== -diff*inv +1;
//         // // diff*eq === 0;
//         // // outseries[i+1] <== outseries[i] + series[i] * eq;
//         // outseries[1+1] <== outseries[1] + series[1] * diff[1];
//         // diff[2] <== exponent - 2;
//         // inv[2] <-- diff[2]!=0 ? 1/diff[2] : 0;
//         // // eq <== -diff*inv +1;
//         // // diff*eq === 0;
//         // // outseries[i+1] <== outseries[i] + series[i] * eq;
//         // outseries[2+1] <== outseries[2] + series[2] * diff[2];

//     answer <== outseries[maxExp+1];
//     // answer <== exponent;
//     // answer <== series[maxExp] + exponent;
// }

template WeirdLoop(base, maxExp){
    signal private input exponent;
    signal output answer;

    signal outseries[maxExp+2];
    outseries[0] <== 0;
    signal diff[maxExp+1];
    signal inv[maxExp+1];

    // the code in the current state does not work
    // if we comment out the loop and unroll it (uncommenting the lines below it),
    // it works. this seems weird because it feels like the unrolled loop should be
    // equivalent.
    //for (var i = 0; i < maxExp+1; i++){
    //    diff[i] <== exponent - i;
    //    inv[i] <-- diff[i]!=0 ? 1/diff[i] : 0;
    //    outseries[i+1] <== outseries[i] + diff[i];
    //}
     diff[0] <== exponent - 0;
     inv[0] <-- diff[0]!=0 ? 1/diff[0] : 0;
     outseries[0+1] <== outseries[0] + diff[0];
     diff[1] <== exponent - 1;
     inv[1] <-- diff[1]!=0 ? 1/diff[1] : 0;
     outseries[1+1] <== outseries[1] + diff[1];
     diff[2] <== exponent - 2;
     inv[2] <-- diff[2]!=0 ? 1/diff[2] : 0;
     outseries[2+1] <== outseries[2] + diff[2];

    answer <== outseries[maxExp+1];
}

component main = WeirdLoop(3, 2);
