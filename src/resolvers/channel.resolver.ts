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
    const {channel} = route.params;
    return this.channelsService.join(channel);
  }
}
