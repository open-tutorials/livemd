import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { deserialize, serialize } from 'serialize-ts';
import { MeManager } from 'src/managers/me.manager';
import { Heap } from 'src/models/heap';
import { getEndpoint } from 'src/utils';

@Injectable({providedIn: 'root'})
export class HeapService {

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

