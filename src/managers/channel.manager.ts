import { EventEmitter, Injectable } from '@angular/core';
import { merge } from 'lodash';
import { Observable, tap } from 'rxjs';
import { deserialize, serialize } from 'serialize-ts';
import { environment } from 'src/environments/environment';
import { MeManager } from 'src/managers/me.manager';
import { Channel, Poll } from 'src/models/channel';
import { ChannelsService, FakeChannelsService } from 'src/services/channels.service';

type ChannelMerge = { member: string, changes: Partial<Channel> };

declare var Pusher: any;

@Injectable({providedIn: 'root'})
export class ChannelManager {

  private pusher: { public?: any, private?: any } = {};
  private id!: string;
  private service: ChannelsService | FakeChannelsService = this.channelsService;
  channel!: Channel;
  updated = new EventEmitter();

  constructor(private channelsService: ChannelsService,
              private fakeChannelsService: FakeChannelsService,
              private meManager: MeManager) {
  }

  fake() {
    this.service = this.fakeChannelsService;
    return this.service.join()
      .pipe(tap(channel => {
        this.channel = channel;
      }));
  }

  join(id: string) {
    [this.id, this.service] = [id, this.channelsService];
    return this.service.join(id)
      .pipe(tap(channel => {
        this.channel = channel;
        this.listen();
      }));
  }

  leave() {
    this.unlisten();
  }

  votePoll(id: string, answer: number): Observable<null> {

    const {me} = this.meManager;

    if (!this.channel.polls[id]) {
      this.channel.polls[id] = new Poll();
    }

    const count = this.channel.polls[id].answers[answer] || 0;
    merge(this.channel.polls[id], {
      voted: {[me.id]: answer},
      answers: {[answer]: count + 1}
    });

    return this.service.votePoll(this.id, id, answer);
  }

  private listen() {

    const {me} = this.meManager;

    const pusher = new Pusher('4fb08c17a97f4b75ef66', {
      cluster: 'eu',
      authEndpoint: [environment.backend, 'channels', this.id, 'auth'].join('/'),
      auth: {
        headers: {
          authorization: `${me.id} XYZ`
        }
      }
    });

    {
      const channel = pusher.subscribe(this.channel.id);
      this.pusher.public = channel;

      channel.bind('channel_updated', ({member, changes}: ChannelMerge) => {
        if (member !== me.id) {
          const toMerge = deserialize(changes, Channel);
          merge(this.channel, serialize(toMerge));
          this.updated.emit();
        }
      });
    }

    {
      const channel = pusher.subscribe(['private', this.channel.id].join('-'));
      this.pusher.private = channel;
    }

  }

  private unlisten() {
    this.pusher.public.disconnect();
    this.pusher.private.disconnect();
  }

}
