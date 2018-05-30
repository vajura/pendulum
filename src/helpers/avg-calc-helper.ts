export function avgCalcHelper(obj: any) {
  obj.avgNumbers.push(obj.amount);
  obj.runningAvg += obj.avgNumbers.tail.value - obj.avgNumbers.tail.previous.value;
  obj.runningAvg -= obj.avgNumbers.head.next.value - obj.avgNumbers.head.value;
  obj.oneMinAvg = obj.runningAvg;
  obj.avgNumbers.popFirst();
}
