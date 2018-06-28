declare var createjs;

export class PendulumLine {

  public static pi180 = Math.PI / 180;
  public shape: any;
  public end: PointInterface = {x: 0, y: 0};
  public prevEnd: PointInterface = {x: 0, y: 0};
  public childLines: PendulumLine[] = [];
  public parentLine: PendulumLine;
  public originalAngle: number;

  static toR(angle) {
    return angle * PendulumLine.pi180;
  }

  constructor (public start: PointInterface, public length: number, public angle: number, public angleChange: number, public draw = false) {
    this.originalAngle = angle;
    this.end.x = this.start.x + this.length * Math.cos(PendulumLine.toR(this.angle));
    this.end.y = this.start.y + this.length * Math.sin(PendulumLine.toR(this.angle));
    this.shape = new createjs.Shape();
    this.shape.graphics.setStrokeStyle(1);
    this.shape.graphics.beginStroke('rgba(128,128,128,0.5)');
    this.start = this.shape.graphics.moveTo(start.x, start.y).command;
    this.end = this.shape.graphics.lineTo(this.end.x, this.end.y).command;
    this.shape.graphics.endStroke();
  }

  addChild(length: number, angle: number, angleChange: number, draw = false) {
    const originalAngle = angle;
    let tempLine: PendulumLine = this;
    while (tempLine) {
      // angleChange += tempLine.angleChange;
      angle += tempLine.originalAngle;
      tempLine = tempLine.parentLine;
    }
    const line = new PendulumLine(this.end, length, angle, angleChange, draw);
    line.originalAngle = originalAngle;
    line.parentLine = this;
    this.childLines.push(line);
  }

  getAngle() {
    const dy = this.end.y - this.start.y;
    const dx = this.end.x - this.start.x;
    let theta = Math.atan2(dy, dx);
    theta *= 180 / Math.PI;
    if (theta < 0) {
      theta = 360 + theta;
    }
    return theta;
  }
}

export interface PointInterface {
  x: number;
  y: number;
}
