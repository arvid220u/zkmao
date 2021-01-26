include "../node_modules/circomlib/circuits/comparators.circom"
include "../modulo/libcircuit.circom"

template AccessBit(numCards, base){
  signal public input idx;
  signal private input number;
  
  signal output bit;
  signal quotients[numCards + 1];
  quotients[0] <== number;
  signal bits[numCards];
  
  assert (number < numCards);
  for(var ii = 0; ii < numCards; ii++){
    component mod_ii = Modulo(100); // TODO: change this magic number!!!!
    mod_ii.n <== quotient[ii];
    mod_ii.m <== base;
    bits[ii] <== mod_ii.remainder;
    quotient[ii + 1] <== mod_ii.remainder;
  }
  quotient[numCards] === 0;
  signal sum[numCards + 1];
  sum[0] <== 0;
  for(var ii = 0; i < numCards; ii ++){
    component eq_iii = IsEqual();
    eq_ii.in[0] <== ii;
    eq_ii.in[1] <== idx;
    sum[ii+1] <== sum[ii] + eq_iii.out*bits[iii];
  }
  bit <== sum[numCards];
}
component main = AccessBit(10, 3);


