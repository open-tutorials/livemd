import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ChannelManager } from 'src/managers/channel.manager';
import { Channel } from 'src/models/channel';

@Injectable({providedIn: 'root'})
export class ChannelResolver implements Resolve<Observable<Channel>> {

  constructor(private channelManager: ChannelManager) {
  }

  resolve(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): Observable<Channel> {
    const channel = route.params['tutorial'] || 'home';
    return this.channelManager.join(channel);
  }
}

@Injectable({providedIn: 'root'})
export class FakeChannelResolver implements Resolve<Observable<Channel>> {

  constructor(private channelManager: ChannelManager) {
  }

  resolve(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): Observable<Channel> {
    return this.channelManager.fake();
  }
}
