import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { serialize } from 'serialize-ts';
import { MeManager } from 'src/managers/me.manager';
import { Channel } from 'src/models/channel';
import { getEndpoint } from 'src/utils';

@Injectable({providedIn: 'root'})
export class ChannelsService {

  constructor(private meManager: MeManager,
              private http: HttpClient) {

  }

  join(id: string): Observable<Channel> {
    const {me} = this.meManager;

    const endpoint = getEndpoint('channels', id, 'join');
    return this.http.post<Channel>(endpoint, serialize(me));
  }

  votePoll(channel: string, line: number, option: number) {
    const {me} = this.meManager;
    const endpoint = getEndpoint('channels', channel, 'members', me.id, 'polls', line);
    return this.http.post<Channel>(endpoint, {option});
  }

}
