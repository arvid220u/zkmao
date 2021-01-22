#!/usr/bin/env bash

DIR=$(echo $1 | sed 's:/*$::')

mkdir $DIR
cp ../powersoftau/pot15_final.ptau $DIR/pot15_final.ptau
touch $DIR/input.json
touch $DIR/circuit.circom
