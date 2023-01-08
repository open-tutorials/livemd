import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
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
