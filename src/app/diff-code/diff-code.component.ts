import {
  AfterViewInit,
  Component,
  ElementRef, HostBinding,
  HostListener,
  Input,
  ViewChild
} from '@angular/core';
import { first } from 'rxjs';
import { MonacoService } from 'src/services/monaco.service';
import { trim } from 'lodash';

const LINE_HEIGHT = 19;

declare var monaco: any;

@Component({
  selector: 'app-diff-code',
  templateUrl: './diff-code.component.html',
  styleUrls: ['./diff-code.component.scss']
})
export class DiffCodeComponent implements AfterViewInit {

  public _editor: any;

  @Input()
  html!: string;

  @Input()
  language: string = 'javascript';

  @HostBinding('style.height.px')
  height: number = 50;

  @ViewChild('editorContainer')
  _container!: ElementRef;

  constructor(private monaco: MonacoService,
              private hostRef: ElementRef) {
  }

  ngAfterViewInit(): void {
    const parser = new DOMParser();
    const doc = parser.parseFromString(this.html, 'text/html');
    const elements = {
      left: doc.body.querySelector('md-diff-left'),
      right: doc.body.querySelector('md-diff-right')
    };

    const decode = (html: string) => {
      const textarea = doc.createElement('textarea');
      textarea.innerHTML = html;
      return textarea.value;
    };

    let left = elements.left?.getAttribute('html');
    if (!left) {
      console.error('left code is not defined');
      return;
    }

    left = this.clear(decode(left));

    let right = elements.right?.getAttribute('html');
    if (!right) {
      console.error('right code is not defined');
      return;
    }
    right = this.clear(decode(right));

    this.init(left, right);
  }

  clear(code: string) {
    const clear = code.replace(/^\n*\`\`\`[a-z\-]+/, '');
    return trim(clear, ' \n`');
  }

  private init(left: string, right: string): void {
    if (!this.monaco.loaded) {
      this.monaco.ready.pipe(first())
        .subscribe(() => this.init(left, right));
      this.monaco.load();
      return;
    }

    this._container.nativeElement.innerHTML = '';
    this._editor = monaco.editor.createDiffEditor(this._container.nativeElement, {
      enableSplitViewResizing: false,
      scrollBeyondLastLine: false,
      readOnly: true
    });
    this._editor.setModel({
      original: monaco.editor.createModel(left, this.language),
      modified: monaco.editor.createModel(right, this.language)
    });

    const height = Math.max(this._editor.getModel().original.getLineCount(),
      this._editor.getModel().modified.getLineCount());

    this.height = height * LINE_HEIGHT;
  }

  @HostListener('window: resize')
  resize() {
    this._editor.layout();
  }

}
