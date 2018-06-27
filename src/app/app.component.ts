import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NotificationService } from '../services/notification-service';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { PendulumLine } from '../models/pendulum-line';
declare var kd;
declare var createjs;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AppComponent implements OnInit, OnDestroy {

  kdTick: any;
  animationTick: any;
  width = 800;
  height = 800;
  mainStage: any;
  mainContainer: any;
  mainCanvas: any;
  mainCtx: any;
  pendulumLines: PendulumLine[] = [];

  constructor(private cdr: ChangeDetectorRef,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.kdTick = setInterval(() => {
      kd.tick();
    }, 25);
    this.mainContainer = document.getElementById('main-container');
    this.mainCanvas = <HTMLCanvasElement>document.getElementById('main-container');
    this.mainCtx = this.mainCanvas.getContext('2d');
    this.mainStage = new createjs.Stage('main-container');

    this.pendulumLines.push(new PendulumLine({x: 400, y: 400}, 150, 0, 1));
    this.pendulumLines[0].addChild(100, 0 , -2);
    this.pendulumLines[0].childLines[0].addChild(50, 0, 2);
    this.pendulumLines[0].childLines[0].childLines[0].addChild(50, 0, 3, true);
    this.pendulumLines[0].childLines[0].childLines[0].addChild(50, 90, 4, true);
    this.pendulumLines[0].childLines[0].childLines[0].addChild(50, 180, 5, true);
    this.pendulumLines[0].childLines[0].childLines[0].addChild(50, 270, 6, true);
    this.addPendulumLines(this.pendulumLines);

    createjs.Ticker.framerate = 60;
    this.animationTick = createjs.Ticker.on('tick', () => {
      this.animate();
    });
  }

  animate() {
    this.calculateLines(this.pendulumLines);
    this.mainStage.update();
  }

  calculateLines(lines: PendulumLine[]) {
    for (let a = 0; a < lines.length; a++) {
      if (lines[a].parentLine) {
        lines[a].start.x = lines[a].parentLine.end.x;
        lines[a].start.y = lines[a].parentLine.end.y;
      }
      lines[a].angle += lines[a].angleChange;
      lines[a].prevEnd = {x: lines[a].end.x, y: lines[a].end.y};
      lines[a].end.x =
        lines[a].start.x + lines[a].length * Math.cos(PendulumLine.toR(lines[a].angle));
      lines[a].end.y =
        lines[a].start.y + lines[a].length * Math.sin(PendulumLine.toR(lines[a].angle));

      if (lines[a].draw) {
        const shape = new createjs.Shape();
        shape.graphics.setStrokeStyle(1);
        shape.graphics.beginStroke('rgba(0,0,0,1)');
        shape.graphics.moveTo(lines[a].prevEnd.x, lines[a].prevEnd.y);
        shape.graphics.lineTo(lines[a].end.x, lines[a].end.y);
        shape.graphics.endStroke();
        this.mainStage.addChild(shape);
      }

      if (lines[a].childLines) {
        this.calculateLines(lines[a].childLines);
      }
    }
  }

  addPendulumLines(lines: PendulumLine[]) {
    for (let a = 0; a < lines.length; a++) {
      this.mainStage.addChild(lines[a].shape);
      if (lines[a].childLines) {
        this.addPendulumLines(lines[a].childLines);
      }
    }
  }

  ngOnDestroy() {
    clearInterval(this.kdTick);
    (createjs.Ticker.off as any)(this.animationTick);
  }
}
