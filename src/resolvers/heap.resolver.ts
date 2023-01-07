import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Heap } from 'src/models/heap';
import { HeapService } from 'src/services/heap.service';

@Injectable({providedIn: 'root'})
export class HeapResolver implements Resolve<Observable<Heap>> {

  constructor(private heapService: HeapService) {
  }

  resolve(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): Observable<Heap> {
    const {channel} = route.params;
    return this.heapService.bind(channel);
  }
}
