include "../node_modules/circomlib/circuits/comparators.circom"
include "../node_modules/circomlib/circuits/mimcsponge.circom"
include "../exponentiate/libcircuit.circom"
include "../accessBit/libcircuit.circom"
template PlayCardsPrivately(numCards){
   signal private input oldCardstate;
   signal private input newCardstate;
   signal public input cardNumber;
   signal private input oldNumCardsInDeck;
   signal private input newNumCardsInDeck;

   signal output oldCommit;
   signal output newCommit;
   
   //make sure you have the played card
   component accessBit = AccessBit(numCards, 3);
   accessBit.idx <== cardNumber;
   accessBit.bit === 1; 

   //make sure the change of state is legal
   component exp = Exponentiate(3, numCards)  
   exp.exponent <== cardNumber;
   signal chosenCardValue <== exp.answer;
   newCardState === oldCardState + chosenCardValue;

   //output the desired hash
   component mimcOld = MiMCSponge(3, 220, 1);
   mimcOld.ins[0] <== oldCardstate;
   mimcOld.ins[1] <== oldNumCardsInDeck;
   mimcOld.ins[2] <== salt1;
   mimcOld.k <== 0;
   oldCommit <== mimcOld.outs[0];
   
   component mimcNew = MiMCSponge(3, 220, 1);
   mimcNew.ins[0] <== newCardstate;                                   
   mimcNew.ins[1] <== newNumCardsInDeck; 
   mimcNew.ins[2] <== salt2;
   mimcNew.k <== 0;                                                   
   newCommit <== mimcNew.outs[0]; 
}

component main = DrawCardsPrivately(10);

