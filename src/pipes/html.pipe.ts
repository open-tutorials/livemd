import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import Token = marked.Token;

@Pipe({name: 'safe'})
export class SafePipe implements PipeTransform {

  constructor(private sr: DomSanitizer) {
  }

  transform(html: string): SafeHtml {
    return this.sr.bypassSecurityTrustHtml(html);
  }

}
