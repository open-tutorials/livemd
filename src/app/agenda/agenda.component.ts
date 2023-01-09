import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  Renderer2
} from '@angular/core';
import { marked } from 'marked';
import { Heading } from 'src/types/heading';
import Token = marked.Token;

const TOP_POSITION = 90;

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss']
})
export class AgendaComponent implements OnInit, OnDestroy {

  private listeners: { scroll?: () => void } = {};

  @Input()
  tokens: Token[] = [];

  @Input()
  headings: Heading[] = [];

  get done(): number {
    return Math.round((this.progress / this.tokens.length - 1) * 100);
  }

  @HostBinding('attr.data-empty')
  get dataEmpty() {
    return this.headings.length === 0;
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
        this.checkInit();

        if ((window.scrollY > TOP_POSITION && !this.sticky)
          || (window.scrollY <= TOP_POSITION && this.sticky)) {
          this.sticky = scrollY > TOP_POSITION;
          const e = this.hostRef.nativeElement;
          this.renderer.setAttribute(e, 'data-sticky', this.sticky.toString());
        }
      });
    });

    this.checkInit();
  }

  checkInit() {
    const e = this.hostRef.nativeElement;
    this.renderer.setAttribute(e, 'data-init', (window.scrollY <= TOP_POSITION).toString());
  }

  ngOnDestroy() {
    this.listeners.scroll?.call(this);
  }

}
