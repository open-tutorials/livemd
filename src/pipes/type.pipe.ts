import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import Token = marked.Token;

@Pipe({name: 'type'})
export class TypePipe implements PipeTransform {

  transform(value: any): string {
    return value === null ? 'null' : typeof value;
  }

}
