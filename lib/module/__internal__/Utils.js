export function getNowTimestamp() {
  return Date.now();
}

// https://www.codegrepper.com/code-examples/javascript/random+number+generator+in+typescript
export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function generateMessageId() {
  return getNowTimestamp().toString() + getRandomInt(1, 99999).toString();
}
//# sourceMappingURL=Utils.js.map