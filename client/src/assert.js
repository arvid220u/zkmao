export default function assert(condition, error_m) {
  if (condition) return;
  console.error("assertion failed");
  console.error(JSON.parse(JSON.stringify(error_m)));
}
