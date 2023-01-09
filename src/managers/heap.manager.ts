import { Injectable } from '@angular/core';
import { merge } from 'lodash';
import { bufferTime, filter, Subject, Subscription, switchMap, tap } from 'rxjs';
import { PREVIEW_TUTORIAL_SLUG } from 'src/consts';
import { Heap } from 'src/models/heap';
import { FakeHeapsService, HeapsService } from 'src/services/heaps.service';

@Injectable({providedIn: 'root'})
export class HeapManager {

  private tutorial!: string;
  private push = new Subject<void>();
  private sync: { push?: Subscription } = {};

  private service: HeapsService | FakeHeapsService = this.heapService;

  heap!: Heap;

  constructor(private heapService: HeapsService,
              private fakeHeapsService: FakeHeapsService) {
  }

  fake() {
    this.service = this.fakeHeapsService;
    return this.service.get()
      .pipe(tap(heap => {
        this.heap = heap;
        this.startPush();
      }));
  }

  bind(tutorial: string) {
    [this.tutorial, this.service] = [tutorial, this.heapService];
    return this.service.get(tutorial)
      .pipe(tap(heap => {
        this.heap = heap;
        this.startPush();
      }));
  }

  stop() {
    this.stopPush();
  }

  startPush() {
    this.sync.push?.unsubscribe();
    this.sync.push = this.push.pipe(bufferTime(2000),
      filter(buffer => buffer.length > 0),
      switchMap(() => this.service.put(this.tutorial, this.heap)))
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

