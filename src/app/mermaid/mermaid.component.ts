import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import mermaid from 'mermaid';
import { nanoid } from 'nanoid';

@Component({
  selector: 'app-mermaid',
  templateUrl: './mermaid.component.html',
  styleUrls: ['./mermaid.component.scss']
})
export class MermaidComponent implements AfterViewInit {

  @Input()
  code!: string;

  @ViewChild('mermaid')
  container!: ElementRef;

  ngAfterViewInit() {
    const e = this.container.nativeElement;
    mermaid.render('mermaid_' + nanoid(10), this.code, (svgCode, bindFunctions) => {
      e.innerHTML = svgCode;
      bindFunctions(e);
    });
  }

}
