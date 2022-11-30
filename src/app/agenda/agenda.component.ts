import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  Renderer2
} from '@angular/core';
import { trimStart } from 'lodash';
import { marked } from 'marked';
import Token = marked.Token;

const TOP_POSITION = 90;

type Heading = marked.Tokens.Heading & { line: number };

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss']
})
export class AgendaComponent implements OnInit, OnDestroy {

  private listeners: { scroll?: () => void } = {};
  private _tokens: Token[] = [];
  headings: Heading[] = [];

  @Input()
  set tokens(tokens: Token[]) {
    this._tokens = tokens;

    const headings: Heading[] = [];
    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i];
      if (t.type === 'heading' && t.text.startsWith('+')) {
        const heading = t as Heading;
        heading.text = trimStart(heading.text, '+');
        heading.line = i;
        headings.push(heading);
      }
    }

    this.headings = headings;
  }

  get done(): number {
    return Math.round((this.progress / this._tokens.length) * 100);
  }

  @Input()
  progress: number = 0;

  @Output()
  block = new EventEmitter();

  sticky: boolean = false;

  constructor(private renderer: Renderer2,
              private ngZone: NgZone,
              private hostRef: ElementRef) {

  }

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.listeners.scroll = this.renderer.listen(window, 'scroll', () => {
        if ((window.scrollY > TOP_POSITION && !this.sticky)
          || (window.scrollY <= TOP_POSITION && this.sticky)) {
          this.sticky = scrollY > TOP_POSITION;
          this.renderer.setAttribute(this.hostRef.nativeElement, 'data-sticky', this.sticky.toString());
        }
      });
    });
  }

  ngOnDestroy() {
    this.listeners.scroll?.call(this);
  }

}
