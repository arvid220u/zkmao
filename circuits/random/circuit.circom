
// return a random number in (0,n]
// randomSource should be a random field element
template Random() {
    signal input n;
    signal input randomSource;
    signal output out;

    out <-- randomSource % n; // TODO: Fix this
}