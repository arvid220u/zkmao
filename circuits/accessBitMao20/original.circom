include "../node_modules/circomlib/circuits/comparators.circom"
include "../modulo/libcircuit.circom"

template AccessBit20(numCards, base){
  signal private input idx;
  signal private input number;
  
  signal output bit;
  signal quotients[numCards + 1];
  quotients[0] <== number;
  signal bits[numCards];
  
  assert (idx < numCards);
  for(var ii = 0; ii < numCards; ii++){
    component mod_ii = Modulo(100); // TODO: change this magic number!!!!
    mod_ii.n <== quotients[ii];
    mod_ii.m <== base;
    bits[ii] <== mod_ii.remainder;
    quotients[ii + 1] <== mod_ii.quotient;
  }
  quotients[numCards] === 0;
  signal sum[numCards + 1];
  sum[0] <== 0;
  for(var ii = 0; ii < numCards; ii++){
    component eq_ii = IsEqual();
    eq_ii.in[0] <== ii;
    eq_ii.in[1] <== idx;
    sum[ii+1] <== sum[ii] + eq_ii.out*bits[ii];
  }
  bit <== sum[numCards];
}
component main = AccessBit(10, 3);
