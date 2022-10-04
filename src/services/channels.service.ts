import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { serialize } from 'serialize-ts';
import { MeManager } from 'src/managers/me.manager';
import { Channel, ChannelUpdate } from 'src/models/channel';
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

  create(markdown: string, baseUrl: string, imagesUrl: string, slug: string, locked: boolean): Observable<Channel> {
    const {me} = this.meManager;
    const endpoint = getEndpoint('channels');
    const channel = new ChannelUpdate({
      markdown,
      baseUrl,
      imagesUrl,
      slug,
      locked,
      owner: me.id
    });
    return this.http.post<Channel>(endpoint, serialize(channel));
  }

  mark(channel: string, line: number, member: string, mark: string | null) {
    const endpoint = getEndpoint('channels', channel, 'members', member, 'marks', line);
    return this.http.post<Channel>(endpoint, {mark});
  }

  votePoll(channel: string, line: number, option: number) {
    const {me} = this.meManager;
    const endpoint = getEndpoint('channels', channel, 'members', me.id, 'polls', line);
    return this.http.post<Channel>(endpoint, {option});
  }

  comment(channel: string, member: string, line: number, comment: string | null) {
    const endpoint = getEndpoint('channels', channel, 'members', member, 'comments', line);
    return this.http.post<Channel>(endpoint, {comment});
  }

  progress(channel: string, line: number) {
    const {me} = this.meManager;
    const endpoint = getEndpoint('channels', channel, 'members', me.id, 'progress');
    return this.http.post<Channel>(endpoint, {line});
  }

}
