import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Channel } from 'src/models/channel';
import { ChannelsService } from 'src/services/channels.service';

@Injectable({providedIn: 'root'})
export class ChannelResolver implements Resolve<Observable<Channel>> {

  constructor(private channelsService: ChannelsService) {
  }

  resolve(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): Observable<Channel> {
    const channel = route.params['tutorial'] || 'home';
    return this.channelsService.join(channel);
  }
}

@Injectable({providedIn: 'root'})
export class FakeChannelResolver implements Resolve<Channel> {

  resolve(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): Channel {
    return new Channel({id: 'preview'});
  }
}
