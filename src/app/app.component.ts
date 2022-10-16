import { Component, Injector, OnInit } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { CodeDiffComponent } from 'src/app/code-diff/code-diff.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private injector: Injector) {
  }

  ngOnInit() {
    if (!customElements.get('code-diff')) {
      const element = createCustomElement(CodeDiffComponent, {injector: this.injector});
      customElements.define('code-diff', element);
    }
  }

}
