import { Pipe, PipeTransform } from '@angular/core';
import { marked } from 'marked';
import { AVATARS, MARKS } from 'src/consts';
import { Me } from 'src/managers/me.manager';
import { Channel } from 'src/models/channel';
import { Member } from 'src/models/member';

@Pipe({name: 'mark'})
export class GetMark implements PipeTransform {

  transform(mark: string): string | null {
    return MARKS[mark] || null;
  }

}

@Pipe({name: 'voted', pure: false})
export class GetVoted implements PipeTransform {

  transform(channel: Channel, me: Me, line: number, option: number): Member[] {
    const voted = [];
    for (const member of Object.keys(channel.polls)) {
      if (member !== me.id && channel.polls[member][line] === option) {
        voted.push(channel.members[member]);
      }
    }
    return voted;
  }

}
