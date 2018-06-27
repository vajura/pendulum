import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NotificationService } from '../services/notification-service';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { TickHandler } from '../models/tick-handler';
import { PenulumLine } from '../models/penulum-line';
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
  pendulumLines: PenulumLine[] = [];
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

    createjs.Ticker.framerate = 2;
    this.animationTick = createjs.Ticker.on('tick', () => {
      this.animate();
    });
    const newLine = new PenulumLine(
      {
        x: 120, y: 350
      }, {
        x: 500, y: 650
      }
    );
    this.pendulumLines.push(newLine.shape);
    for (let a = 0; a < this.pendulumLines.length; a++) {
      this.mainStage.addChild(this.pendulumLines[a].shape);
    }
  }

  animate() {
    for (let a = 0; a < this.pendulumLines.length; a++) {
      this.pendulumLines[a].end.y += 1;
    }
    this.mainStage.update();
  }

  ngOnDestroy() {
    clearInterval(this.kdTick);
    createjs.Ticker.off(this.animationTick);
  }
}
