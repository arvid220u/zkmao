
// return a random number in (0,n]
// randomSource should be a random field element
template Random() {
    signal input n;
    signal input randomSource;
    signal output out;

    component mod = Modulo(100); // TODO: fix this magic number!!!
    mod.n <== randomSource;
    mod.m <== n;
    out <== mod.remainder;
}

