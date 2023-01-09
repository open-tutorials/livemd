import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { HeapManager } from 'src/managers/heap.manager';
import { Heap } from 'src/models/heap';

@Injectable({providedIn: 'root'})
export class HeapResolver implements Resolve<Observable<Heap>> {

  constructor(private heapManager: HeapManager) {
  }

  resolve(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): Observable<Heap> {
    const tutorial = route.params['tutorial'] || 'home';
    return this.heapManager.bind(tutorial);
  }
}
