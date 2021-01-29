#!/usr/bin/env bash


destination="../client/public/circuits"
echo "removing old files"
rm -r "$destination"
mkdir "$destination"

declare -a arr=("playCard" "drawcardsprivately" "maoRule" "drawcardspublicly")
echo "unrolling"
./unroll.sh $1 $2
echo "libifying"
./libify.sh
for i in "${arr[@]}"
do
  #clean the folders
  echo "cleaning" $i
  ./clean.sh $i
  #compile it
  echo "compiling" $i
  ./compile.sh $i  
  #Copy the files to the desired location
  echo "deploying" $i 
  mkdir $destination/$i
  mkdir $destination/$i/compiled-circuit
  cp $i/circuit.wasm $destination/$i/compiled-circuit/circuit.wasm
  mkdir $destination/$i/keys
  cp $i/circuit_final.zkey $destination/$i/keys/circuit_final.zkey
  cp $i/verification_key.json $destination/$i/keys/verification_key.json
done

