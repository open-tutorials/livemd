import { Pipe, PipeTransform } from '@angular/core';
import { marked } from 'marked';
import { AVATARS } from 'src/consts';

@Pipe({name: 'avatar'})
export class GetAvatar implements PipeTransform {

  transform(avatar: string): string {
    return AVATARS[avatar];
  }

}
