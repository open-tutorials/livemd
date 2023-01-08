import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import mermaid from 'mermaid';
import { nanoid } from 'nanoid';

@Component({
  selector: 'app-mermaid',
  templateUrl: './mermaid.component.html',
  styleUrls: ['./mermaid.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class MermaidComponent implements AfterViewInit {

  @Input()
  code!: string;

  @Input()
  url!: string;

  @ViewChild('mermaid')
  container!: ElementRef;

  constructor(private http: HttpClient) {
  }

  ngAfterViewInit() {
    if (!!this.url) {
      this.http.get(this.url + '?rand=' + Math.random(), {responseType: 'text'})
        .subscribe(code => this.render(code));
    } else {
      this.render(this.code);
    }
  }

  private render(code: string) {
    const chart = [
      `%%{
  init: {
    'theme': 'base',
    'flowchart': { 'curve': 'monotoneX' },
    'themeVariables': {
      'primaryColor': '#F1F3FC',
      'lineColor': '#96A0B6',
      'primaryTextColor': '#071D49',
      'fontSize': '14px',
      'clusterBkg': '#FFFFFF'
    }
  }
}%%`, code];

    const e = this.container.nativeElement;
    mermaid.render('mermaid_' + nanoid(10), chart.join('\n'),
      (svgCode, bindFunctions) => {
        e.innerHTML = svgCode;
        !!bindFunctions ? bindFunctions(e) : null;
      });
  }

}
