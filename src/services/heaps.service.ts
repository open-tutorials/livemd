import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { deserialize, serialize } from 'serialize-ts';
import { MeManager } from 'src/managers/me.manager';
import { Heap } from 'src/models/heap';
import { getEndpoint } from 'src/utils';

const FAKE_HEAP_KEY = 'fake_heap';

@Injectable({providedIn: 'root'})
export class HeapsService {

  constructor(private meManager: MeManager,
              private http: HttpClient) {

  }

  get(tutorial: string): Observable<Heap> {
    const {me} = this.meManager;
    const endpoint = getEndpoint('tutorials', tutorial, 'heaps', me.id);
    return this.http.get<Object>(endpoint)
      .pipe(map(data => deserialize(data, Heap)));
  }

  put(tutorial: string, heap: Heap): Observable<null> {
    const {me} = this.meManager;
    const endpoint = getEndpoint('tutorials', tutorial, 'heaps', me.id);
    return this.http.post(endpoint, serialize(heap))
      .pipe(map(() => null));
  }

}

@Injectable({providedIn: 'root'})
export class FakeHeapsService {

  get(): Observable<Heap> {
    const json = localStorage.getItem(FAKE_HEAP_KEY);
    return of(!!json ? deserialize(JSON.parse(json), Heap) : new Heap());
  }

  put(tutorial: string, heap: Heap): Observable<null> {
    localStorage.setItem(FAKE_HEAP_KEY, JSON.stringify(serialize(heap)));
    return of(null);
  }

}

