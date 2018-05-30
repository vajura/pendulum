import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NotificationService } from '../services/notification-service';
declare var kd;
declare var $;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AppComponent implements OnInit {

  width = 800;
  height = 800;
  htmlContainer: any;
  mainContainer: any;
  mainCanvas: any;
  mainCtx: any;
  constructor(private cdr: ChangeDetectorRef,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    setInterval(() => {
      kd.tick();
    }, 25);
    this.htmlContainer = $('html');
    this.mainContainer = $('#main-container');
    this.mainCanvas = <HTMLCanvasElement>document.getElementById('main-container');
    this.mainCtx = this.mainCanvas.getContext('2d');
    // this.mainStage = new createjs.Stage('main-container');
  }
}
