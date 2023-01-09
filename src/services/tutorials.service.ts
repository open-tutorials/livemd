import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { deserialize } from 'serialize-ts';
import { MeManager } from 'src/managers/me.manager';
import { Tutorial } from 'src/models/tutorial';
import { getEndpoint } from 'src/utils';

@Injectable({providedIn: 'root'})
export class TutorialsService {

  constructor(private meManager: MeManager,
              private http: HttpClient) {
  }

  get(slug: string): Observable<Tutorial> {
    const endpoint = getEndpoint('tutorials', slug);
    return this.http.get<Object>(endpoint)
      .pipe(map(data => deserialize(data, Tutorial)));
  }
}
