import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Input,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { deserialize, Field, Model } from 'serialize-ts';
import { HeapManager } from 'src/managers/heap.manager';

@Model()
export class Circle {

  @Field()
  time!: number;

  @Field()
  poster!: string;

  @Field()
  video!: string;

}

@Component({
  selector: 'md-circle',
  templateUrl: './circle.component.html',
  styleUrls: ['./circle.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CircleComponent {

  private _id!: string;

  heap = this.heapManager.heap;

  circle!: Circle;
  md!: string;
  opened = false;
  loading = true;

  @Input()
  set id(id: string) {
    this._id = id;
    this.opened = this.heap.circles?.[id] || false;
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

  get watching() {
    return !this.loading && !this.videoRef?.nativeElement?.paused && !this.videoRef?.nativeElement?.muted;
  }

  @ViewChild('videoRef')
  videoRef!: ElementRef<HTMLVideoElement>;

  constructor(private heapManager: HeapManager,
              public cd: ChangeDetectorRef) {
  }

  loadStart(){
    this.loading = true;
  }

  loaded() {
    this.loading = false;
    this.cd.detectChanges();
  }

  watched() {
    const e = this.videoRef.nativeElement;
    e.muted = true;
    e.loop = false;
    e.autoplay = false;
    e.currentTime = this.circle.time || 0;
    if (this.circle.poster) {
      e.load();
    }
    this.heapManager.put({circles: {[this.id]: true}});
    this.opened = true;
    this.cd.detectChanges();
  }

  unmute() {
    const e = this.videoRef.nativeElement;
    if (e.muted || e.paused) {
      e.currentTime = 0;
      e.play();
      e.muted = false;
      e.loop = false;
    } else {
      if (this.opened) {
        e.pause();
        e.currentTime = this.circle.time;
      } else {
        e.loop = true;
        e.muted = true;
      }
    }
    this.cd.detectChanges();
  }

}
