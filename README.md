# zkcards

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
