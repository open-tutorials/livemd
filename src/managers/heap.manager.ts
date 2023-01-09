import { Injectable } from '@angular/core';
import { merge } from 'lodash';
import { bufferTime, filter, Subject, Subscription, switchMap, tap } from 'rxjs';
import { Heap } from 'src/models/heap';
import { HeapService } from 'src/services/heap.service';

@Injectable({providedIn: 'root'})
export class HeapManager {

  private tutorial!: string;
  private push = new Subject<void>();
  private sync: { push?: Subscription } = {};

  heap!: Heap;

  constructor(private heapService: HeapService) {
  }

  bind(tutorial: string) {
    this.tutorial = tutorial;
    return this.heapService.get(tutorial)
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
      switchMap(() => this.heapService.put(this.tutorial, this.heap)))
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

@Injectable()
export class FakeHeapManager {

  heap: Heap = new Heap();

  put(data: Partial<Heap>) {
    merge(this.heap, data);
  }

}
