import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding, HostListener,
  Input,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { deserialize, Field, Model } from 'serialize-ts';
import { HeapManager } from 'src/managers/heap.manager';

@Model()
export class HowTo {

  @Field()
  video!: string;

  @Field()
  width!: number;

  @Field()
  height!: number;

}

@Component({
  selector: 'md-how-to',
  templateUrl: './how-to.component.html',
  styleUrls: ['./how-to.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HowToComponent {

  howTo!: HowTo;

  @Input()
  set config(config: string) {
    this.howTo = deserialize(JSON.parse(config), HowTo);
  }

  @Input()
  assetsUrl!: string;

  opened = false;

  @ViewChild('videoRef')
  videoRef!: ElementRef<HTMLVideoElement>;

  constructor(private hostRef: ElementRef) {
  }

  loaded() {
    console.log(this.videoRef.nativeElement.duration);
  }

  @HostListener('click')
  open() {
    this.opened = !this.opened;
    if (this.opened) {
      this.videoRef.nativeElement.currentTime = 0;
    }
  }

  @HostListener('document:click', ['$event'])
  close(event: MouseEvent): void {
    if (!this.hostRef.nativeElement.contains(event.target)) {
      this.opened = false;
    }
  }

}
