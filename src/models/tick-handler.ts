declare var createjs;

export class TickHandler {
  static liveTicks: TickObj[] = [];

  static tickChecker() {
    for (let a = 0; a < TickHandler.liveTicks.length; a++) {
      if (TickHandler.liveTicks[a].killTick > 3) {
        if (TickHandler.liveTicks[a].tickType === TickTypeInterface.CREATEJS) {
          createjs.Ticker.off(TickHandler.liveTicks[a].tickObj);
        } else if (TickHandler.liveTicks[a].tickType === TickTypeInterface.NORMAL) {
          clearInterval(TickHandler.liveTicks[a].tickObj);
        }
      }
    }
  }
}

export interface TickObj {
  tickObj: any;
  tickType: TickTypeInterface;
  killTick: number;
}

export enum TickTypeInterface {
  NORMAL,
  CREATEJS,
}
