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

  @ViewChild('mermaid')
  container!: ElementRef;

  ngAfterViewInit() {
    const e = this.container.nativeElement;
    const code = [
      `%%{
  init: {
    'theme': 'base',
    'themeVariables': {
      'primaryColor': '#F1F3FC',
      'lineColor': '#96A0B6',
      'primaryTextColor': '#071D49',
      'fontSize': '14px',
      'clusterBkg': '#F1F3FC'
    }
  }
}%%`, this.code];

    mermaid.render('mermaid_' + nanoid(10), code.join("\n"), (svgCode, bindFunctions) => {
      e.innerHTML = svgCode;
      !!bindFunctions ? bindFunctions(e) : null;
    });
  }

}
