declare var createjs;

export class PenulumLine {
  public shape: any;
  public start: PointInterface;
  public end: PointInterface;

  constructor (start: PointInterface, end: PointInterface) {
    this.shape = new createjs.Shape();
    this.shape.graphics.setStrokeStyle(1);
    this.shape.graphics.beginStroke('rgba(0,0,0,1)');
    this.start = this.shape.graphics.moveTo(start.x, start.y).command;
    this.end = this.shape.graphics.lineTo(end.x, end.y).command;
    this.shape.graphics.endStroke();
  }
}

export interface PointInterface {
  x: number;
  y: number;
}
