#!/usr/bin/env bash

declare -a arr=("accessBit" "exponentiate" "ithk" "maoRule" "accessBitMao10" "accessBitMao20")
numCards=$1
numInts=$2
bitsPerInt=200
for i in "${arr[@]}"
do
   source ./$i/unroll.sh
done

