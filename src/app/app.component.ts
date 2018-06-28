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
  mainCanvas: any;
  mainCtx: any;
  backgroundCanvas: any;
  backgroundCtx: any;
  backgroundImageData: any;
  backgroundData32: Uint32Array;
  pendulumLines: PendulumLine[] = [];

  constructor(private cdr: ChangeDetectorRef,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.kdTick = setInterval(() => {
      kd.tick();
    }, 25);
    this.backgroundCanvas = <HTMLCanvasElement>document.getElementById('background-container');
    this.backgroundCtx = this.backgroundCanvas.getContext('2d');
    this.mainCanvas = <HTMLCanvasElement>document.getElementById('main-container');
    this.mainCtx = this.mainCanvas.getContext('2d');
    this.mainStage = new createjs.Stage('main-container');

    this.pendulumLines.push(new PendulumLine({x: 400, y: 400}, 100, 0, 1));
    this.pendulumLines[0].addChild(50, 0 , -5);
    this.pendulumLines[0].childLines[0].addChild(25, 0, 16, true);
    this.addPendulumLines(this.pendulumLines);

    this.backgroundImageData = this.backgroundCtx.createImageData(this.width, this.height);
    this.backgroundData32 = new Uint32Array(this.backgroundImageData.data.buffer);

    createjs.Ticker.framerate = 120;
    this.animationTick = createjs.Ticker.on('tick', () => {
      this.animate();
    });
  }

  animate() {
    this.calculateLines(this.pendulumLines);
    this.backgroundCtx.putImageData(this.backgroundImageData, 0, 0);
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
        const points: number[] = this.getLinePoints(
          Math.round(lines[a].prevEnd.x),
          Math.round(lines[a].prevEnd.y),
          Math.round(lines[a].end.x),
          Math.round(lines[a].end.y)
        );
        for (let b = 0; b < points.length; b++) {
          this.backgroundData32[points[b]] = 0XFF000000;
        }
      }

      if (lines[a].childLines) {
        this.calculateLines(lines[a].childLines);
      }
    }
  }

  getLinePoints(x0, y0, x1, y1): number[] {
    const points: number[] = [];
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = (x0 < x1) ? 1 : -1;
    const sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;

    while (true) {
      points.push(y0 * this.width + x0);
      if ((x0 === x1) && (y0 === y1)) {
        break;
      }
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy; x0  += sx;
      }
      if (e2 < dx) {
        err += dx; y0  += sy;
      }
    }
    return points;
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
