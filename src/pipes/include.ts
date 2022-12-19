import { Pipe, PipeTransform } from '@angular/core';
import { marked } from 'marked';
import { AVATARS } from 'src/consts';

@Pipe({name: 'include'})
export class IncludePipe implements PipeTransform {

  transform(arr: any[], obj: any): boolean {
    return arr.includes(obj);
  }

}
