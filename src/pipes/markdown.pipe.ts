import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { template } from 'lodash';
import { marked } from 'marked';
import Slugger = marked.Slugger;
import Token = marked.Token;

@Pipe({name: 'tokens'})
export class GetTokens implements PipeTransform {

  transform(markdown: string): any[] {
    return marked.lexer(markdown);
  }

}

@Pipe({name: 'slug'})
export class GetSlugPipe implements PipeTransform {
  transform(text: string): string {
    const slugger = new Slugger();
    return slugger.slug(text);
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

@Pipe({name: 'mdInline2Html'})
export class MdInline2HtmlPipe implements PipeTransform {

  constructor(private sr: DomSanitizer) {
  }

  transform(md: string): SafeHtml {
    const html = marked.parseInline(md);
    return this.sr.bypassSecurityTrustHtml(html);
  }

}

@Pipe({name: 'interpolate'})
export class InterpolatePipe implements PipeTransform {

  transform(source: string, scope: Object | undefined): string {
    const t = template(source);
    return t(scope);
  }

}
