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

    // TODO: IT FEELS LIKE THIS IS INSECURE.
    // potential exploit:
    //  - create a really big remainder
    //  - create a negative quotient
    //  - the range checks only checks numBits bits, and the remainder will be seen as 0 there
    //  - the equation may still hold
    //  - this is bad because the big remainder can be used to generate fake proofs later, potentially
}

component main = Modulo(100);