import { Injectable } from '@angular/core';
import { merge } from 'lodash';
import { bufferTime, filter, Subject, Subscription, switchMap, tap } from 'rxjs';
import { Heap } from 'src/models/heap';
import { FakeHeapsService, HeapsService } from 'src/services/heaps.service';

@Injectable({providedIn: 'root'})
export class HeapManager {

  private tutorial!: string;
  private push = new Subject<Heap>();

  private service: HeapsService | FakeHeapsService = this.heapService;

  heap!: Heap;

  constructor(private heapService: HeapsService,
              private fakeHeapsService: FakeHeapsService) {
    this.startPush();
  }

  private startPush() {
    console.log('start push');
    this.push.pipe(tap(heap => console.log(heap)), bufferTime(2000),
      tap(buffer => console.log(buffer)),
      filter(buffer => buffer.length > 0),
      tap(buffer => console.log(buffer)),
      switchMap(buffer => this.service.put(this.tutorial, buffer.pop() as Heap)))
      .subscribe(() => console.log('heap is synced'));
  }

  fake() {
    this.service = this.fakeHeapsService;
    return this.service.get()
      .pipe(tap(heap => this.heap = heap));
  }

  bind(tutorial: string) {
    [this.tutorial, this.service] = [tutorial, this.heapService];
    return this.service.get(tutorial)
      .pipe(tap(heap => this.heap = heap));
  }

  put(data: Partial<Heap>) {
    console.log('push heap');
    merge(this.heap, data);
    this.push.next(this.heap);
  }

}

