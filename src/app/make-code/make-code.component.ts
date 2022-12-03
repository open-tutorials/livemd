import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import hljs from 'highlight.js/lib/core';

const PLACEHOLDER_TEMPLATE = /([\'\"]*)\?\|((?:(?!\}\?)(?:.))+)\|\?([\'\"]*)/;
const HLJS_PLACEHOLDERS = '.hljs-string, .hljs-comment';

@Component({
  selector: 'app-make-code',
  templateUrl: './make-code.component.html',
  styleUrls: ['./make-code.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
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

    const placeholders = doc.body.querySelectorAll(HLJS_PLACEHOLDERS);
    for (let i = 0; i < placeholders.length; i++) {
      const placeholder = placeholders[i];
      const match = PLACEHOLDER_TEMPLATE.exec(placeholder.innerHTML);
      if (!!match) {
        placeholder.innerHTML = '';
        const [, left, answer, right] = match;
        if (!!left) {
          placeholder.appendChild(document.createTextNode(left));
        }
        const p = document.createElement('md-placeholder');
        p.setAttribute('value', answer);
        p.setAttribute('context', [this.context, i].join('|'));
        placeholder.appendChild(p);
        if (!!right) {
          placeholder.appendChild(document.createTextNode(right));
        }
      }
    }

    this.codeRef.nativeElement.innerHTML = doc.body.innerHTML;
  }
}
