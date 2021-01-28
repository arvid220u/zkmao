import * as snarkjs from "snarkjs";
const pathToSnarks = "circuits/";
/*
 *params:
 * circuitInput: an Object that maps the circuit input to their values (write integers as strings)
 * circuitName: name of the circuit, this project has three circuits:
 *    playCards, maoRules, drawcardsprivately
 *output:
 * An object containing the proof and public signals
 */
export async function prove(circuitInput, circuitName) {
  return await snarkjs.groth16.fullProve(
    circuitInput,
    pathToSnarks.concat(circuitName, "/compiled-circuit/circuit.wasm"),
    pathToSnarks.concat(circuitName, "/keys/circuit_final.zkey")
  );
}

/*
 *params:
 * circuitName: name of the circuit, this project has three circuits:
 *     playCards, maoRules, drawcardsprivately
 * publicSignals: the public signal outputted by the circuit
 * proof: the proof outputted by the circuit
 *output:
 * A boolean specifying whether the proof is correct
 */
export async function verify(circuitName, publicSignals, proof) {
  const vKey = await fetch(
    pathToSnarks.concat(circuitName, "/keys/verification_key.json")
  )
    .then((res) => res.json())
    .catch((err) => alert(err));
  return await snarkjs.groth16.verify(vKey, publicSignals, proof);
}
