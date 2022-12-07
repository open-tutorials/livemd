import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef, EventEmitter, HostListener,
  Input,
  NgZone, OnDestroy,
  OnInit, Output,
  ViewChild
} from '@angular/core';
import { filter } from 'rxjs';
import { HeapService } from 'src/services/heap.service';

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
export class TimerComponent implements OnInit, OnDestroy {

  private heap = this.heapService.heap;

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

  constructor(private heapService: HeapService,
              private cd: ChangeDetectorRef,
              private zone: NgZone) {
  }

  ngOnInit() {
    const time = this.heap.timers?.[this.id];
    if (!!time) {
      this.time = time;
    }
    this.remained > 0 ? this.start() : this.stop();
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  start() {
    const tick = () => {
      if (this.remained-- > 0) {
        this.render();
        this.heapService.put({timers: {[this.id]: this.time}});
        this.timer = setTimeout(() => tick(), 1000);
      } else {
        this.finished.emit();
      }
    };

    clearInterval(this.timer);
    this.cd.detectChanges();

    this.zone.runOutsideAngular(() => tick());
  }

  stop() {
    this.finished.emit();
  }

  render() {
    this.timerRef.nativeElement.innerHTML = this.time;
  }

}
