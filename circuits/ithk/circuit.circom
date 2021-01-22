include "../../node_modules/circomlib/circuits/mimcsponge.circom"
include "../../node_modules/circomlib/circuits/comparators.circom"
include "../modulo/libcircuit.circom"

// computes j s.t. j is the index of the ith k digit in the b-ary representation of n
// we index from least significant digit, starting from 0
// only works if j < numDigits
template IthK(b, k, numDigits){
    signal input i;
    signal input n;
    signal output j;

    signal digits[numDigits];
    signal divided[numDigits+1];
    divided[0] <== n;
    
        component mod_0 = Modulo(100); // TODO: change this magic number!!!!
        mod_0.n <== divided[0];
        mod_0.m <== b;
        digits[0] <== mod_0.remainder;
        divided[0+1] <-- (divided[0] - digits[0]) / b;
        b * divided[0+1] === divided[0] - digits[0];
    
        component mod_1 = Modulo(100); // TODO: change this magic number!!!!
        mod_1.n <== divided[1];
        mod_1.m <== b;
        digits[1] <== mod_1.remainder;
        divided[1+1] <-- (divided[1] - digits[1]) / b;
        b * divided[1+1] === divided[1] - digits[1];
    
        component mod_2 = Modulo(100); // TODO: change this magic number!!!!
        mod_2.n <== divided[2];
        mod_2.m <== b;
        digits[2] <== mod_2.remainder;
        divided[2+1] <-- (divided[2] - digits[2]) / b;
        b * divided[2+1] === divided[2] - digits[2];
    
        component mod_3 = Modulo(100); // TODO: change this magic number!!!!
        mod_3.n <== divided[3];
        mod_3.m <== b;
        digits[3] <== mod_3.remainder;
        divided[3+1] <-- (divided[3] - digits[3]) / b;
        b * divided[3+1] === divided[3] - digits[3];
    
        component mod_4 = Modulo(100); // TODO: change this magic number!!!!
        mod_4.n <== divided[4];
        mod_4.m <== b;
        digits[4] <== mod_4.remainder;
        divided[4+1] <-- (divided[4] - digits[4]) / b;
        b * divided[4+1] === divided[4] - digits[4];
    
        component mod_5 = Modulo(100); // TODO: change this magic number!!!!
        mod_5.n <== divided[5];
        mod_5.m <== b;
        digits[5] <== mod_5.remainder;
        divided[5+1] <-- (divided[5] - digits[5]) / b;
        b * divided[5+1] === divided[5] - digits[5];
    
        component mod_6 = Modulo(100); // TODO: change this magic number!!!!
        mod_6.n <== divided[6];
        mod_6.m <== b;
        digits[6] <== mod_6.remainder;
        divided[6+1] <-- (divided[6] - digits[6]) / b;
        b * divided[6+1] === divided[6] - digits[6];
    
        component mod_7 = Modulo(100); // TODO: change this magic number!!!!
        mod_7.n <== divided[7];
        mod_7.m <== b;
        digits[7] <== mod_7.remainder;
        divided[7+1] <-- (divided[7] - digits[7]) / b;
        b * divided[7+1] === divided[7] - digits[7];
    
        component mod_8 = Modulo(100); // TODO: change this magic number!!!!
        mod_8.n <== divided[8];
        mod_8.m <== b;
        digits[8] <== mod_8.remainder;
        divided[8+1] <-- (divided[8] - digits[8]) / b;
        b * divided[8+1] === divided[8] - digits[8];
    
        component mod_9 = Modulo(100); // TODO: change this magic number!!!!
        mod_9.n <== divided[9];
        mod_9.m <== b;
        digits[9] <== mod_9.remainder;
        divided[9+1] <-- (divided[9] - digits[9]) / b;
        b * divided[9+1] === divided[9] - digits[9];
    

    signal counter[numDigits+1];
    counter[0] <== 0;
    
        component iseq1_0 = IsEqual();
        iseq1_0.in[0] <== digits[0];
        iseq1_0.in[1] <== k;
        counter[0+1] <== counter[0] + iseq1_0.out;
    
        component iseq1_1 = IsEqual();
        iseq1_1.in[0] <== digits[1];
        iseq1_1.in[1] <== k;
        counter[1+1] <== counter[1] + iseq1_1.out;
    
        component iseq1_2 = IsEqual();
        iseq1_2.in[0] <== digits[2];
        iseq1_2.in[1] <== k;
        counter[2+1] <== counter[2] + iseq1_2.out;
    
        component iseq1_3 = IsEqual();
        iseq1_3.in[0] <== digits[3];
        iseq1_3.in[1] <== k;
        counter[3+1] <== counter[3] + iseq1_3.out;
    
        component iseq1_4 = IsEqual();
        iseq1_4.in[0] <== digits[4];
        iseq1_4.in[1] <== k;
        counter[4+1] <== counter[4] + iseq1_4.out;
    
        component iseq1_5 = IsEqual();
        iseq1_5.in[0] <== digits[5];
        iseq1_5.in[1] <== k;
        counter[5+1] <== counter[5] + iseq1_5.out;
    
        component iseq1_6 = IsEqual();
        iseq1_6.in[0] <== digits[6];
        iseq1_6.in[1] <== k;
        counter[6+1] <== counter[6] + iseq1_6.out;
    
        component iseq1_7 = IsEqual();
        iseq1_7.in[0] <== digits[7];
        iseq1_7.in[1] <== k;
        counter[7+1] <== counter[7] + iseq1_7.out;
    
        component iseq1_8 = IsEqual();
        iseq1_8.in[0] <== digits[8];
        iseq1_8.in[1] <== k;
        counter[8+1] <== counter[8] + iseq1_8.out;
    
        component iseq1_9 = IsEqual();
        iseq1_9.in[0] <== digits[9];
        iseq1_9.in[1] <== k;
        counter[9+1] <== counter[9] + iseq1_9.out;
    

    signal rightIndex[numDigits+1];
    rightIndex[0] <== 0;
    
        component iseq2_0 = IsEqual();
        iseq2_0.in[0] <== counter[0+1];
        iseq2_0.in[1] <== i+1;
        rightIndex[0+1] <== iseq2_0.out;
    
        component iseq2_1 = IsEqual();
        iseq2_1.in[0] <== counter[1+1];
        iseq2_1.in[1] <== i+1;
        rightIndex[1+1] <== iseq2_1.out;
    
        component iseq2_2 = IsEqual();
        iseq2_2.in[0] <== counter[2+1];
        iseq2_2.in[1] <== i+1;
        rightIndex[2+1] <== iseq2_2.out;
    
        component iseq2_3 = IsEqual();
        iseq2_3.in[0] <== counter[3+1];
        iseq2_3.in[1] <== i+1;
        rightIndex[3+1] <== iseq2_3.out;
    
        component iseq2_4 = IsEqual();
        iseq2_4.in[0] <== counter[4+1];
        iseq2_4.in[1] <== i+1;
        rightIndex[4+1] <== iseq2_4.out;
    
        component iseq2_5 = IsEqual();
        iseq2_5.in[0] <== counter[5+1];
        iseq2_5.in[1] <== i+1;
        rightIndex[5+1] <== iseq2_5.out;
    
        component iseq2_6 = IsEqual();
        iseq2_6.in[0] <== counter[6+1];
        iseq2_6.in[1] <== i+1;
        rightIndex[6+1] <== iseq2_6.out;
    
        component iseq2_7 = IsEqual();
        iseq2_7.in[0] <== counter[7+1];
        iseq2_7.in[1] <== i+1;
        rightIndex[7+1] <== iseq2_7.out;
    
        component iseq2_8 = IsEqual();
        iseq2_8.in[0] <== counter[8+1];
        iseq2_8.in[1] <== i+1;
        rightIndex[8+1] <== iseq2_8.out;
    
        component iseq2_9 = IsEqual();
        iseq2_9.in[0] <== counter[9+1];
        iseq2_9.in[1] <== i+1;
        rightIndex[9+1] <== iseq2_9.out;
    

    signal answer[numDigits+1];
    answer[0] <== 0;
    
        signal diff_0 <== rightIndex[0+1] - rightIndex[0];
        component iseq3_0 = IsEqual();
        iseq3_0.in[0] <== diff_0;
        iseq3_0.in[1] <== 1;
        answer[0+1] <== answer[0] + iseq3_0.out * 0;
    
        signal diff_1 <== rightIndex[1+1] - rightIndex[1];
        component iseq3_1 = IsEqual();
        iseq3_1.in[0] <== diff_1;
        iseq3_1.in[1] <== 1;
        answer[1+1] <== answer[1] + iseq3_1.out * 1;
    
        signal diff_2 <== rightIndex[2+1] - rightIndex[2];
        component iseq3_2 = IsEqual();
        iseq3_2.in[0] <== diff_2;
        iseq3_2.in[1] <== 1;
        answer[2+1] <== answer[2] + iseq3_2.out * 2;
    
        signal diff_3 <== rightIndex[3+1] - rightIndex[3];
        component iseq3_3 = IsEqual();
        iseq3_3.in[0] <== diff_3;
        iseq3_3.in[1] <== 1;
        answer[3+1] <== answer[3] + iseq3_3.out * 3;
    
        signal diff_4 <== rightIndex[4+1] - rightIndex[4];
        component iseq3_4 = IsEqual();
        iseq3_4.in[0] <== diff_4;
        iseq3_4.in[1] <== 1;
        answer[4+1] <== answer[4] + iseq3_4.out * 4;
    
        signal diff_5 <== rightIndex[5+1] - rightIndex[5];
        component iseq3_5 = IsEqual();
        iseq3_5.in[0] <== diff_5;
        iseq3_5.in[1] <== 1;
        answer[5+1] <== answer[5] + iseq3_5.out * 5;
    
        signal diff_6 <== rightIndex[6+1] - rightIndex[6];
        component iseq3_6 = IsEqual();
        iseq3_6.in[0] <== diff_6;
        iseq3_6.in[1] <== 1;
        answer[6+1] <== answer[6] + iseq3_6.out * 6;
    
        signal diff_7 <== rightIndex[7+1] - rightIndex[7];
        component iseq3_7 = IsEqual();
        iseq3_7.in[0] <== diff_7;
        iseq3_7.in[1] <== 1;
        answer[7+1] <== answer[7] + iseq3_7.out * 7;
    
        signal diff_8 <== rightIndex[8+1] - rightIndex[8];
        component iseq3_8 = IsEqual();
        iseq3_8.in[0] <== diff_8;
        iseq3_8.in[1] <== 1;
        answer[8+1] <== answer[8] + iseq3_8.out * 8;
    
        signal diff_9 <== rightIndex[9+1] - rightIndex[9];
        component iseq3_9 = IsEqual();
        iseq3_9.in[0] <== diff_9;
        iseq3_9.in[1] <== 1;
        answer[9+1] <== answer[9] + iseq3_9.out * 9;
    

    j <== answer[numDigits];
}

component main = IthK(2, 0, 10);
