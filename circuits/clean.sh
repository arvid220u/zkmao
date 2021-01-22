#!/usr/bin/env bash

DIR=$(echo $1 | sed 's:/*$::')

cd $DIR
if [ $2=" " ]; then
    echo "removing unrolled"
    rm circuit.circom
fi
rm circuit.wasm circuit.r1cs circuit.sym circuit.r1cs.json
rm circuit_$DIR.zkey circuit_final.zkey
rm verification_key.json proof.json public.json
rm witness.wtns
