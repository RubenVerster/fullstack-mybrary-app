// you can write to stdout for debugging purposes, e.g.
// console.log('this is a debug message');

function solution(N) {
  //convert to binary
  let binaryInteger = (N % 2).toString();
  for (; N > 1; ) {
    N = parseInt(N / 2);
    binaryInteger = (N % 2) + binaryInteger;
  }

  //stores the indexes of 1's
  let oneIndexes = [];

  for (i = 0; i < binaryInteger.length; i++) {
    if (binaryInteger[i] == 1) {
      oneIndexes.push(i);
    }
  }

  //stores the length of all the 0 sequences calculated in the for below
  let binaryLengths = [];

  for (i = 0; i < oneIndexes.length - 1; i++) {
    calc0lengths = oneIndexes[i + 1] - oneIndexes[i] - 1;
    binaryLengths.push(calc0lengths);
  }

  binaryLengths.sort((a, b) => b - a);

  if (binaryLengths[0] <= 0 || binaryLengths.length < 2) return 0;

  return binaryLengths[0];
  //such a hack algorith XD
}
