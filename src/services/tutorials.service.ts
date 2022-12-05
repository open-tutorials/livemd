import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TUTORIALS } from 'src/consts';
import { MeManager } from 'src/managers/me.manager';
import { Tutorial } from 'src/models/tutorial';

@Injectable({providedIn: 'root'})
export class TutorialsService {

  constructor(private meManager: MeManager,
              private http: HttpClient) {

  }

  get(slug: string): Observable<Tutorial> {
    const tutorial = TUTORIALS[slug];
    return new Observable<Tutorial>(o => {
      this.http.get(tutorial.source + '?rand=' + Math.random(), {responseType: 'text'})
        .subscribe(markdown => {
          tutorial.markdown = markdown;
          o.next(tutorial);
          o.complete();
        });
    });
  }
}
