import { Component, Injector, OnInit } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { DiffCodeComponent } from 'src/app/diff-code/diff-code.component';
import { MermaidComponent } from 'src/app/mermaid/mermaid.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private injector: Injector) {
  }

  ngOnInit() {
    if (!customElements.get('md-diff-code')) {
      const element = createCustomElement(DiffCodeComponent, {injector: this.injector});
      customElements.define('md-diff-code', element);
    }

    if (!customElements.get('md-mermaid')) {
      const element = createCustomElement(MermaidComponent, {injector: this.injector});
      customElements.define('md-mermaid', element);
    }
  }

}
