include "../../node_modules/circomlib/circuits/mimcsponge.circom"
include "../../node_modules/circomlib/circuits/comparators.circom"

template Modulo(numBits) {
    signal input n;
    signal input m;

    signal output quotient;
    signal output remainder;

    remainder <-- n % m;
    quotient <-- (n - remainder) / m;

    n === m * quotient + remainder;

    component let = LessEqThan(numBits);
    let.in[0] <== 0;
    let.in[1] <== remainder;
    let.out === 1;

    component lt = LessThan(numBits);
    lt.in[0] <== remainder;
    lt.in[1] <== m;
    lt.out === 1;
}

