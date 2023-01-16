import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { deserialize, serialize } from 'serialize-ts';
import { MeManager } from 'src/managers/me.manager';
import { Channel } from 'src/models/channel';
import { getEndpoint } from 'src/utils';

const FAKE_CHANNELS_KEY = 'fake_channel';

@Injectable({providedIn: 'root'})
export class ChannelsService {

  constructor(private meManager: MeManager,
              private http: HttpClient) {

  }

  join(id: string): Observable<Channel> {
    const {me} = this.meManager;

    const endpoint = getEndpoint('channels', id, 'join');
    return this.http.post<Channel>(endpoint, serialize(me),
      {
        headers: {
          authorization: `${me.id} XYZ`
        }
      });
  }

  votePoll(channel: string, id: string, answer: number) {
    const {me} = this.meManager;
    const endpoint = getEndpoint('channels', channel, 'polls', id, 'vote');
    return this.http.post<Channel>(endpoint, {answer}, {
      headers: {
        authorization: `${me.id} XYZ`
      }
    }).pipe(map(() => null));
  }

}

@Injectable({providedIn: 'root'})
export class FakeChannelsService {

  join(): Observable<Channel> {
    const json = localStorage.getItem(FAKE_CHANNELS_KEY);
    return of(!!json ? deserialize(JSON.parse(json), Channel) : new Channel());
  }

  votePoll(channel: string, id: string, answer: number) {
    return of(null);
  }

}
