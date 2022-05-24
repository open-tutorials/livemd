import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef, EventEmitter,
  Input,
  NgZone,
  OnInit, Output,
  ViewChild
} from '@angular/core';
import { filter } from 'rxjs';
import { TimerEvents } from 'src/app/timer/timer-events.service';

const SECONDS_IN_MINUTE = 60;

function pad(num: number) {
  return num < 10 ? '0' + num.toString() : num;
}

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimerComponent implements OnInit {

  @Input()
  id!: number;

  @Input()
  set time(time: string) {
    const [minutes, seconds] = time.split(':');
    this.remained = +minutes * SECONDS_IN_MINUTE + +seconds;
  }

  get time() {
    const minutes = Math.floor(this.remained / SECONDS_IN_MINUTE);
    const seconds = this.remained % SECONDS_IN_MINUTE;
    return [pad(minutes), pad(seconds)].join(':');
  }

  @Input()
  manage!: boolean;

  @Input()
  remained!: number;

  @Output()
  started = new EventEmitter<string>();

  @Output()
  stopped = new EventEmitter<string>();

  @ViewChild('timerRef')
  timerRef!: ElementRef<HTMLDivElement>;

  timer: any = null;

  constructor(private events: TimerEvents,
              private cd: ChangeDetectorRef,
              private zone: NgZone) {
  }

  ngOnInit() {
    this.events.broadcast$.pipe(filter(({id}) => this.id === id))
      .subscribe(({type, time}) => {
        switch (type) {
          case 'started':
            this.doStart(time);
            break;
          case 'stopped':
            this.doStop(time);
            break;
        }
      });
  }

  private doStart(time: string | null = null) {
    if (!!time) {
      this.time = time;
    }
    const tick = () => {
      if (this.remained-- > 0) {
        this.render();
        this.timer = setTimeout(() => tick(), 1000);
      }
    };

    clearInterval(this.timer);
    this.timer = -1;
    this.cd.detectChanges();

    this.zone.runOutsideAngular(() => tick());
  }

  private doStop(time: string | null = null) {
    if (!!time) {
      this.time = time;
    }
    clearInterval(this.timer);
    this.timer = null;
    this.cd.detectChanges();
  }

  render() {
    this.timerRef.nativeElement.innerHTML = this.time;
  }

  start() {
    this.doStart();
    this.started.emit(this.time);
  }

  stop() {
    this.doStop();
    this.stopped.emit(this.time);
  }

}
