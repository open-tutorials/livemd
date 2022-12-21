import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, ElementRef,
  Input, ViewChild
} from '@angular/core';
import { deserialize, Field, Model } from 'serialize-ts';
import { HeapService } from 'src/services/heap.service';

@Model()
export class Master {

  @Field()
  name!: string;

  @Field()
  avatar!: string;

}

@Model()
export class Message {

  @Field()
  from!: Master;

  @Field()
  src!: string;

}

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
  opened = false;

  @Input()
  set id(id: string) {
    this._id = id;
    this.accepted = this.headService.heap.messages?.[id] || false;
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
    this.opened = true;
    if(!this.accepted) {
      this.accepted = true;
      this.headService.put({messages: {[this.id]: true}});
    }
    this.cd.detectChanges();
    this.videoRef.nativeElement.play();
  }

}
