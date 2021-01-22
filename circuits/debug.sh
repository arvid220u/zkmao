#!/usr/bin/env bash

DIR=$(echo $1 | sed 's:/*$::')

if [ $# -gt 1 ]; then
    echo "unrolling using command: ./unroll.py $DIR/circuit_raw.circom ${@:2}"
    ./unroll.py $DIR/circuit_raw.circom ${@:2}
fi
cp ../powersoftau/pot15_final.ptau $DIR/pot15_final.ptau
cd $DIR
circom circuit.circom --r1cs --wasm --sym -v
snarkjs r1cs info circuit.r1cs
snarkjs r1cs export json circuit.r1cs circuit.r1cs.json
snarkjs zkey new circuit.r1cs pot15_final.ptau circuit_$DIR.zkey
snarkjs zkey beacon circuit_$DIR.zkey circuit_final.zkey 0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f 10
snarkjs zkey export verificationkey circuit_final.zkey verification_key.json
# snarkjs wtns calculate circuit.wasm input.json witness.wtns
snarkjs wtns debug circuit.wasm input.json witness.wtns circuit.sym --trigger --get --set
snarkjs groth16 prove circuit_final.zkey witness.wtns proof.json public.json
snarkjs groth16 verify verification_key.json public.json proof.json
