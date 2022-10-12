import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef, EventEmitter, HostListener,
  Input,
  NgZone,
  OnInit, Output,
  ViewChild
} from '@angular/core';
import { filter } from 'rxjs';

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
  id!: string;

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
  remained!: number;

  @Output()
  finished = new EventEmitter<string>();

  @ViewChild('timerRef')
  timerRef!: ElementRef<HTMLDivElement>;

  timer: any = null;

  constructor(private cd: ChangeDetectorRef,
              private zone: NgZone) {
  }

  ngOnInit() {
    const time = localStorage.getItem(this.id);
    if (!!time) {
      this.time = time;
    }
    this.remained > 0 ? this.start() : this.stop();
  }

  start() {
    const tick = () => {
      if (this.remained-- > 0) {
        this.render();
        localStorage.setItem(this.id, this.time);
        this.timer = setTimeout(() => tick(), 1000);
      } else {
        this.finished.emit();
      }
    };

    clearInterval(this.timer);
    this.cd.detectChanges();

    this.zone.runOutsideAngular(() => tick());
  }

  @HostListener('dblclick')
  stop() {
    this.finished.emit();
  }

  render() {
    this.timerRef.nativeElement.innerHTML = this.time;
  }

}
