import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import Token = marked.Token;

@Pipe({name: 'tokens'})
export class GetTokens implements PipeTransform {

  transform(markdown: string): any[] {
    return marked.lexer(markdown);
  }

}

@Pipe({name: 'token2Html'})
export class Token2Html implements PipeTransform {

  constructor(private sr: DomSanitizer) {
  }

  transform(token: Token): SafeHtml {
    const html = marked.parser([token]);
    return this.sr.bypassSecurityTrustHtml(html);
  }

}

@Pipe({name: 'md2Html'})
export class Md2Html implements PipeTransform {

  constructor(private sr: DomSanitizer) {
  }

  transform(md: string): SafeHtml {
    const html = marked.parse(md);
    return this.sr.bypassSecurityTrustHtml(html);
  }

}
