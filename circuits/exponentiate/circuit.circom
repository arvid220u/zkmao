include "../../node_modules/circomlib/circuits/comparators.circom"
template Exponentiate(base, maxExponent){
  signal private input exponent;
  signal output answer;
  signal powers[maxExponent + 1];
  assert(exponent <= maxExponent);
  assert(exponent >= 0);
  powers[0] <== 1;
  
    powers[0+1] <== base * powers[0];
  
    powers[1+1] <== base * powers[1];
  
    powers[2+1] <== base * powers[2];
  
    powers[3+1] <== base * powers[3];
  
    powers[4+1] <== base * powers[4];
  
    powers[5+1] <== base * powers[5];
  
    powers[6+1] <== base * powers[6];
  
    powers[7+1] <== base * powers[7];
  
    powers[8+1] <== base * powers[8];
  
    powers[9+1] <== base * powers[9];
  
  signal sum[maxExponent + 2];
  sum[0] <== 0;
  
    component eq_0 = IsEqual();
    eq_0.in[0] <== 0;
    eq_0.in[1] <== exponent;
    sum[0+1] <== sum[0] + eq_0.out*powers[0]; 
    
  
    component eq_1 = IsEqual();
    eq_1.in[0] <== 1;
    eq_1.in[1] <== exponent;
    sum[1+1] <== sum[1] + eq_1.out*powers[1]; 
    
  
    component eq_2 = IsEqual();
    eq_2.in[0] <== 2;
    eq_2.in[1] <== exponent;
    sum[2+1] <== sum[2] + eq_2.out*powers[2]; 
    
  
    component eq_3 = IsEqual();
    eq_3.in[0] <== 3;
    eq_3.in[1] <== exponent;
    sum[3+1] <== sum[3] + eq_3.out*powers[3]; 
    
  
    component eq_4 = IsEqual();
    eq_4.in[0] <== 4;
    eq_4.in[1] <== exponent;
    sum[4+1] <== sum[4] + eq_4.out*powers[4]; 
    
  
    component eq_5 = IsEqual();
    eq_5.in[0] <== 5;
    eq_5.in[1] <== exponent;
    sum[5+1] <== sum[5] + eq_5.out*powers[5]; 
    
  
    component eq_6 = IsEqual();
    eq_6.in[0] <== 6;
    eq_6.in[1] <== exponent;
    sum[6+1] <== sum[6] + eq_6.out*powers[6]; 
    
  
    component eq_7 = IsEqual();
    eq_7.in[0] <== 7;
    eq_7.in[1] <== exponent;
    sum[7+1] <== sum[7] + eq_7.out*powers[7]; 
    
  
    component eq_8 = IsEqual();
    eq_8.in[0] <== 8;
    eq_8.in[1] <== exponent;
    sum[8+1] <== sum[8] + eq_8.out*powers[8]; 
    
  
    component eq_9 = IsEqual();
    eq_9.in[0] <== 9;
    eq_9.in[1] <== exponent;
    sum[9+1] <== sum[9] + eq_9.out*powers[9]; 
    
  
    component eq_10 = IsEqual();
    eq_10.in[0] <== 10;
    eq_10.in[1] <== exponent;
    sum[10+1] <== sum[10] + eq_10.out*powers[10]; 
    
  
  answer <== sum[maxExponent + 1];
}

component main = Exponentiate(3, 10);
