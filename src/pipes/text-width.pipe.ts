import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'textWidth'})
export class TextWidthPipe implements PipeTransform {

  transform(text: string, charWidth: number = 10): number {
    return (text.length + 1) * charWidth;
  }

}
