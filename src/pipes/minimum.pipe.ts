import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import Token = marked.Token;

@Pipe({name: 'maximum'})
export class MaximumPipe implements PipeTransform {

  transform(a: number, b: number): number {
    return Math.max(a, b);
  }

}
