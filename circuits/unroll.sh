#!/usr/bin/env bash

declare -a arr=("accessBit" "exponentiate" "ithk")
numCards=$1
for i in "${arr[@]}"
do
   source ./$i/unroll.sh
done

