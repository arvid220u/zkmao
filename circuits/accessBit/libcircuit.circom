include "../node_modules/circomlib/circuits/comparators.circom"
include "../modulo/libcircuit.circom"

template AccessBit(numCards, base){
  signal private input idx;
  signal private input number;
  
  signal output bit;
  signal quotients[numCards + 1];
  quotients[0] <== number;
  signal bits[numCards];
  
  assert (idx < numCards);
  
    component mod_0 = Modulo(100); // TODO: change this magic number!!!!
    mod_0.n <== quotients[0];
    mod_0.m <== base;
    bits[0] <== mod_0.remainder;
    quotients[0 + 1] <== mod_0.quotient;
  
    component mod_1 = Modulo(100); // TODO: change this magic number!!!!
    mod_1.n <== quotients[1];
    mod_1.m <== base;
    bits[1] <== mod_1.remainder;
    quotients[1 + 1] <== mod_1.quotient;
  
    component mod_2 = Modulo(100); // TODO: change this magic number!!!!
    mod_2.n <== quotients[2];
    mod_2.m <== base;
    bits[2] <== mod_2.remainder;
    quotients[2 + 1] <== mod_2.quotient;
  
    component mod_3 = Modulo(100); // TODO: change this magic number!!!!
    mod_3.n <== quotients[3];
    mod_3.m <== base;
    bits[3] <== mod_3.remainder;
    quotients[3 + 1] <== mod_3.quotient;
  
    component mod_4 = Modulo(100); // TODO: change this magic number!!!!
    mod_4.n <== quotients[4];
    mod_4.m <== base;
    bits[4] <== mod_4.remainder;
    quotients[4 + 1] <== mod_4.quotient;
  
    component mod_5 = Modulo(100); // TODO: change this magic number!!!!
    mod_5.n <== quotients[5];
    mod_5.m <== base;
    bits[5] <== mod_5.remainder;
    quotients[5 + 1] <== mod_5.quotient;
  
    component mod_6 = Modulo(100); // TODO: change this magic number!!!!
    mod_6.n <== quotients[6];
    mod_6.m <== base;
    bits[6] <== mod_6.remainder;
    quotients[6 + 1] <== mod_6.quotient;
  
    component mod_7 = Modulo(100); // TODO: change this magic number!!!!
    mod_7.n <== quotients[7];
    mod_7.m <== base;
    bits[7] <== mod_7.remainder;
    quotients[7 + 1] <== mod_7.quotient;
  
    component mod_8 = Modulo(100); // TODO: change this magic number!!!!
    mod_8.n <== quotients[8];
    mod_8.m <== base;
    bits[8] <== mod_8.remainder;
    quotients[8 + 1] <== mod_8.quotient;
  
    component mod_9 = Modulo(100); // TODO: change this magic number!!!!
    mod_9.n <== quotients[9];
    mod_9.m <== base;
    bits[9] <== mod_9.remainder;
    quotients[9 + 1] <== mod_9.quotient;
  
  quotients[numCards] === 0;
  signal sum[numCards + 1];
  sum[0] <== 0;
  
    component eq_0 = IsEqual();
    eq_0.in[0] <== 0;
    eq_0.in[1] <== idx;
    sum[0+1] <== sum[0] + eq_0.out*bits[0];
  
    component eq_1 = IsEqual();
    eq_1.in[0] <== 1;
    eq_1.in[1] <== idx;
    sum[1+1] <== sum[1] + eq_1.out*bits[1];
  
    component eq_2 = IsEqual();
    eq_2.in[0] <== 2;
    eq_2.in[1] <== idx;
    sum[2+1] <== sum[2] + eq_2.out*bits[2];
  
    component eq_3 = IsEqual();
    eq_3.in[0] <== 3;
    eq_3.in[1] <== idx;
    sum[3+1] <== sum[3] + eq_3.out*bits[3];
  
    component eq_4 = IsEqual();
    eq_4.in[0] <== 4;
    eq_4.in[1] <== idx;
    sum[4+1] <== sum[4] + eq_4.out*bits[4];
  
    component eq_5 = IsEqual();
    eq_5.in[0] <== 5;
    eq_5.in[1] <== idx;
    sum[5+1] <== sum[5] + eq_5.out*bits[5];
  
    component eq_6 = IsEqual();
    eq_6.in[0] <== 6;
    eq_6.in[1] <== idx;
    sum[6+1] <== sum[6] + eq_6.out*bits[6];
  
    component eq_7 = IsEqual();
    eq_7.in[0] <== 7;
    eq_7.in[1] <== idx;
    sum[7+1] <== sum[7] + eq_7.out*bits[7];
  
    component eq_8 = IsEqual();
    eq_8.in[0] <== 8;
    eq_8.in[1] <== idx;
    sum[8+1] <== sum[8] + eq_8.out*bits[8];
  
    component eq_9 = IsEqual();
    eq_9.in[0] <== 9;
    eq_9.in[1] <== idx;
    sum[9+1] <== sum[9] + eq_9.out*bits[9];
  
  bit <== sum[numCards];
}
