import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, ElementRef,
  Input, ViewChild
} from '@angular/core';
import { deserialize } from 'serialize-ts';
import { Message } from 'src/models/message';
import { HeapService } from 'src/services/heap.service';

@Component({
  selector: 'message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageComponent {

  private _id!: string;

  heap = this.headService.heap;

  message!: Message;
  accepted = false;

  @Input()
  set id(id: string) {
    this._id = id;
    this.accepted = this.headService.heap.messages[id] || false;
  }

  get id() {
    return this._id;
  }

  @Input()
  set config(config: string) {
    this.message = deserialize(JSON.parse(config), Message);
  }

  @ViewChild('videoRef')
  videoRef!: ElementRef<HTMLVideoElement>;

  constructor(private headService: HeapService,
              private cd: ChangeDetectorRef) {
  }

  play() {
    this.accepted = true;
    this.cd.detectChanges();
    this.headService.put({messages: {[this.id]: true}});
    this.videoRef.nativeElement.play();
  }

}
