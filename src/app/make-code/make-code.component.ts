import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import hljs from 'highlight.js/lib/core';

const PLACEHOLDER_TEMPLATE = /([\'\"]*)\?\|((?:(?!\}\?)(?:.))+)\|\?([\'\"]*)/;
const HLJS_PLACEHOLDERS = '.hljs-string, .hljs-comment';

@Component({
  selector: 'app-make-code',
  templateUrl: './make-code.component.html',
  styleUrls: ['./make-code.component.scss']
})
export class MakeCodeComponent implements AfterViewInit {

  @ViewChild('codeRef')
  codeRef!: ElementRef<HTMLPreElement>;

  @Input()
  code!: string;

  @Input()
  language!: string;

  @Input()
  context!: string;

  ngAfterViewInit() {
    this.render();
  }

  private render() {
    let highlighted = hljs.highlight(this.code, {language: this.language}).value;
    const parser = new DOMParser();
    const doc = parser.parseFromString(highlighted, 'text/html');

    doc.body.querySelectorAll(HLJS_PLACEHOLDERS).forEach(s => {
      const match = PLACEHOLDER_TEMPLATE.exec(s.innerHTML);
      if (!!match) {
        s.innerHTML = '';
        const [, left, answer, right] = match;
        if (!!left) {
          s.appendChild(document.createTextNode(left));
        }
        const placeholder = document.createElement('md-placeholder');
        placeholder.setAttribute('value', answer);
        placeholder.setAttribute('context', this.context);
        s.appendChild(placeholder);
        if (!!right) {
          s.appendChild(document.createTextNode(right));
        }
      }
    });
    this.codeRef.nativeElement.innerHTML = doc.body.innerHTML;
  }
}
