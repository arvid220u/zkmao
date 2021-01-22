include "../../node_modules/circomlib/circuits/comparators.circom"
template Exponentiate(base, maxExponent){
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
    component eq_iii = IsEqual();
    eq_iii.in[0] <== iii;
    eq_iii.in[1] <== exponent;
    sum[iii+1] <== sum[iii] + eq_iii.out*powers[iii]; 
    
  }
  answer <== sum[maxExponent + 1];
}

component main = Exponentiate(3, 10);
