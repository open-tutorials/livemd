import { Injectable } from '@angular/core';
import { merge } from 'lodash';
import { tap } from 'rxjs';
import { Channel } from 'src/models/channel';
import { Heap } from 'src/models/heap';
import { ChannelsService } from 'src/services/channels.service';

@Injectable({providedIn: 'root'})
export class ChannelManager {

  private tutorial!: string;
  channel!: Channel;

  constructor(private channelsService: ChannelsService) {
  }

  bind(tutorial: string) {
    this.tutorial = tutorial;
    return this.channelsService.join(tutorial)
      .pipe(tap(channel => {
        this.channel = channel;
      }));
  }

  votePoll(line: number, option: number) {
    return this.channelsService.votePoll(this.tutorial, line, option);
  }

}
