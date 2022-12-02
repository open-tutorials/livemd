import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';

const REGEX = /\[\[\[[^\]\[]+]]]/g;
const POINTER_START = `'[[[`;
const POINTER_END = `]]]'`;
const POINTER_JS = /```\w*/g;

@Component({
  selector: 'app-make-code',
  templateUrl: './make-code.component.html',
  styleUrls: ['./make-code.component.scss']
})
export class MakeCodeComponent implements AfterViewInit {

  @ViewChild('code')
  codeHtml!: ElementRef;

  @Input()
  html!: string;

  ngAfterViewInit() {
    if (!!this.html) {
      this.html = this.html.replace(POINTER_JS, '');
      let js = hljs.highlight(this.html, {language: 'javascript'}).value;
      js = js.replace(/amp;/g, '');
      const parser = new DOMParser();
      const doc = parser.parseFromString(js, 'text/html');

      doc.body.querySelectorAll('.hljs-string')?.forEach(s => {
        if (!!s.innerHTML.match(REGEX)) {
          const answer = s.innerHTML.replace(POINTER_START, '').replace(POINTER_END, '').trim();
          const placeholder = document.createElement('md-placeholder');
          placeholder.setAttribute('value', answer);
          placeholder.style.verticalAlign = 'middle';
          s.replaceChildren(placeholder);
        }
      });
      this.codeHtml.nativeElement.innerHTML = doc.body.innerHTML;
    }
  }
}
