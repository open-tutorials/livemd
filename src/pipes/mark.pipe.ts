import { Pipe, PipeTransform } from '@angular/core';
import { marked } from 'marked';
import { AVATARS, MARKS } from 'src/consts';

@Pipe({name: 'mark'})
export class GetMark implements PipeTransform {

  transform(mark: string): string | null {
    return MARKS[mark] || null;
  }

}
