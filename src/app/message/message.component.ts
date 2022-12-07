import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, ElementRef,
  Input, ViewChild
} from '@angular/core';
import { deserialize } from '@junte/serialize-ts';
import { Message } from 'src/models/message';

@Component({
  selector: 'message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageComponent {

  accepted = false;

  @Input()
  config!: string;

  @ViewChild('videoRef')
  videoRef!: ElementRef<HTMLVideoElement>;

  get message() {
    return deserialize(JSON.parse(this.config), Message);
  }

  constructor(private cd: ChangeDetectorRef) {
  }

  play() {
    this.accepted = true;
    this.cd.detectChanges();
    this.videoRef.nativeElement.play();
  }

}
