import * as utils from "./utils.js";

export default function assert(condition, error_m) {
  if (condition) return;
  console.error("assertion failed");
  console.error(utils.objectify(error_m));
}
