#!/usr/bin/env bash

declare -a arr=("accessBit" "exponentiate" "ithk" "maoRules")
numCards=$1
numInts=$2
for i in "${arr[@]}"
do
   source ./$i/unroll.sh
done

