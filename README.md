# zkcards

zksnarks for a card game.

setup:
- each player has their own deck
- each player should be able to randomly draw a card from the deck (without replacement)
- the players' hands should be private
- players should be able to play their cards
- it should not be possible to cheat

the main circuit is `circuit/drawcardsprivately`. the other circuits are helper circuits.

## setup

run

```
npm install
```

to install `circom`, `snarkjs` and `circomlib`.

## running

first `cd circuits`.

then you need to unroll:

```
./unroll.py ithk/circuit_raw.circom numDigits 10
```

and

```
./unroll.py exponentiate/original.circom maxExponent 10
```

then you need to libify:

```
./libify.sh
```

then edit `drawcardsprivately/input.json` and run:

```
./compile.sh drawcardsprivately
```
