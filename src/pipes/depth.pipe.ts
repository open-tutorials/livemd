import { Pipe, PipeTransform } from '@angular/core';
import { marked } from 'marked';
import Token = marked.Token;
import Heading = marked.Tokens.Heading;

@Pipe({name: 'depth'})
export class GetDepth implements PipeTransform {

  transform(token: Token): number {
    return (token as Heading).depth || 0;
  }

}
