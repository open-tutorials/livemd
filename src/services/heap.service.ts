import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { merge } from 'lodash';
import {
  bufferTime,
  debounceTime, filter,
  map,
  Observable,
  Subject,
  Subscription,
  switchMap,
  tap
} from 'rxjs';
import { deserialize, serialize } from 'serialize-ts';
import { MeManager } from 'src/managers/me.manager';
import { Channel } from 'src/models/channel';
import { Heap } from 'src/models/heap';
import { getEndpoint } from 'src/utils';

@Injectable({providedIn: 'root'})
export class HeapService {

  channel!: Channel;
  heap!: Heap;

  push = new Subject<void>();
  sync: { push?: Subscription } = {};

  constructor(private meManager: MeManager,
              private http: HttpClient) {

  }

  bind(channel: Channel): Observable<Heap> {
    this.channel = channel;

    const {me} = this.meManager;

    const endpoint = getEndpoint('channels', channel.id, 'heaps', me.id);
    return this.http.get<Object>(endpoint)
      .pipe(map(data => deserialize(data, Heap)),
        tap(heap => {
          this.heap = heap;
          this.startPush();
        }));
  }

  stop() {
    this.stopPush();
  }

  startPush() {
    const {me} = this.meManager;
    const endpoint = getEndpoint('channels', this.channel.id, 'heaps', me.id);

    this.sync.push?.unsubscribe();
    this.sync.push = this.push.pipe(bufferTime(2000),
      filter(buffer => buffer.length > 0),
      switchMap(() => this.http.post(endpoint, serialize(this.heap))))
      .subscribe(() => console.log('heap is synced'));
  }

  stopPush() {
    this.sync.push?.unsubscribe();
  }

  put(data: Partial<Heap>) {
    merge(this.heap, data);
    this.push.next();
  }

}
