import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { deserialize } from 'serialize-ts';
import { PREVIEW_TUTORIAL_KEY } from 'src/consts';
import { Tutorial } from 'src/models/tutorial';
import { TutorialsService } from 'src/services/tutorials.service';

@Injectable({providedIn: 'root'})
export class TutorialResolver implements Resolve<Observable<Tutorial>> {

  constructor(private tutorialsService: TutorialsService) {
  }

  resolve(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): Observable<Tutorial> {
    const channel = route.params['channel'] || 'home';
    return this.tutorialsService.get(channel);
  }
}

@Injectable({providedIn: 'root'})
export class PreviewTutorialResolver implements Resolve<Tutorial> {

  resolve(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): Tutorial {
    const json = localStorage.getItem(PREVIEW_TUTORIAL_KEY);
    if (!json) {
      throw new Error('No preview tutorial in local storage');
    }
    return deserialize(JSON.parse(json), Tutorial);
  }
}
