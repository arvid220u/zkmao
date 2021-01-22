include "../../node_modules/circomlib/circuits/comparators.circom"
template exponentiate(base, maxExponent){
  signal private input exponent;
  signal output answer;
  signal powers[maxExponent + 1];
  assert(exponent <= maxExponent);
  assert(exponent >= 0);
  powers[0] <== 1;
  for(var ii = 0; ii < maxExponent; ii++){
    powers[ii+1] <== base * powers[ii];
  }
  signal sum[maxExponent + 2];
  sum[0] <== 0;
  for(var iii = 0; iii < maxExponent + 1; iii++){
    component eq_iii = isEqual();
    eq_iii.in[0] <== iii;
    eq_iii.in[1] <== exponent;
    sum[iii+1] <== sum[iii] + eq_iii.out*powers[i]; 
    
  }
  answer <== sum[maxEponent + 1];
}

component main = exponentiate(3, 10);
