import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, ElementRef, HostBinding,
  Input, ViewChild
} from '@angular/core';
import { deserialize, Field, Model } from 'serialize-ts';
import { HeapService } from 'src/services/heap.service';

@Model()
export class Circle {

  @Field()
  poster!: string;

  @Field()
  video!: string;

}

@Component({
  selector: 'circle',
  templateUrl: './circle.component.html',
  styleUrls: ['./circle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CircleComponent {

  private _id!: string;

  heap = this.headService.heap;

  circle!: Circle;
  md!: string;
  opened = false;

  @Input()
  set id(id: string) {
    this._id = id;
    this.opened = this.headService.heap.circles?.[id] || false;
  }

  get id() {
    return this._id;
  }

  @Input()
  set config(config: string) {
    const [json, md] = config.split(/\n\n(.*)/s);
    this.circle = deserialize(JSON.parse(json), Circle);
    this.md = md;
  }

  @HostBinding('class.watching')
  get watching() {
    return !this.videoRef?.nativeElement?.paused && !this.videoRef?.nativeElement?.muted;
  }

  @ViewChild('videoRef')
  videoRef!: ElementRef<HTMLVideoElement>;

  constructor(private headService: HeapService,
              public cd: ChangeDetectorRef) {
  }

  watched() {
    const e = this.videoRef.nativeElement;
    e.muted = true;
    e.loop = true;
    e.autoplay = false;
    e.currentTime = 0;
    e.load();
    this.headService.put({circles: {[this.id]: true}});
    this.cd.detectChanges();
  }

  unmute() {
    const e = this.videoRef.nativeElement;
    e.muted = false;
    e.loop = false;
    e.currentTime = 0;
    !this.opened || e.paused ? e.play() : e.pause();
    this.cd.detectChanges();
  }

}