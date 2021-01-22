include "../../node_modules/circomlib/circuits/mimcsponge.circom"
include "../../node_modules/circomlib/circuits/comparators.circom"
include "../modulo/libcircuit.circom"

// computes j s.t. j is the index of the ith k digit in the b-ary representation of n
// we index from least significant digit, starting from 0
// only works if j < numDigits
template IthK(b, k, numDigits){
    signal input i;
    signal input n;
    signal output j;

    signal digits[numDigits];
    signal divided[numDigits+1];
    divided[0] <== n;
    for (var ii = 0; ii < numDigits; ii++) {
        component mod_ii = Modulo(100); // TODO: change this!!!!
        mod_ii.n <== divided[ii];
        mod_ii.m <== b;
        digits[ii] <== mod_ii.remainder;
        divided[ii+1] <-- (divided[ii] - digits[ii]) / b;
        b * divided[ii+1] === divided[ii] - digits[ii];
    }

    signal counter[numDigits+1];
    counter[0] <== 0;
    for (var ii = 0; ii < numDigits; ii++) {
        component iseq_ii = IsEqual();
        iseq_ii.in[0] <== digits[ii];
        iseq_ii.in[1] <== k;
        counter[ii+1] <== counter[ii] + iseq_ii.out;
    }

    signal rightIndex[numDigits+1];
    rightIndex[0] <== 0;
    for (var ii = 0; ii < numDigits; ii++) {
        component iseq_ii = IsEqual();
        iseq_ii.in[0] <== counter[ii+1];
        iseq_ii.in[1] <== i+1;
        rightIndex[ii+1] <== iseq_ii.out;
    }

    signal answer[numDigits+1];
    for (var ii = 0; ii < numDigits; ii++) {
        signal diff_ii <== rightIndex[ii+1] - rightIndex[ii];
        component iseq_ii = IsEqual();
        iseq_ii.in[0] <== diff_ii;
        iseq_ii.in[1] <== 1;
        answer[ii+1] <== answer[ii] + iseq_ii.out * ii;
    }

    j <== answer[numDigits];
}

component main = IthK(2, 0, 10);
