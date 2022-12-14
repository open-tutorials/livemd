import { Component, Injector, OnInit } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { DiffCodeComponent } from 'src/app/diff-code/diff-code.component';
import { MessageComponent } from 'src/app/message/message.component';
import { AppPlaceholderComponent } from 'src/app/placeholder/app-placeholder.component';
import { MakeCodeComponent } from 'src/app/make-code/make-code.component';
import { MermaidComponent } from 'src/app/mermaid/mermaid.component';
import { RobotComponent } from 'src/app/robot/robot.component';

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

    if (!customElements.get('md-make-code')) {
      const element = createCustomElement(MakeCodeComponent, {injector: this.injector});
      customElements.define('md-make-code', element);
    }

    if (!customElements.get('md-placeholder')) {
      const element = createCustomElement(AppPlaceholderComponent, {injector: this.injector});
      customElements.define('md-placeholder', element);
    }

    if (!customElements.get('md-message')) {
      const element = createCustomElement(MessageComponent, {injector: this.injector});
      customElements.define('md-message', element);
    }

    if (!customElements.get('md-robot')) {
      const element = createCustomElement(RobotComponent, {injector: this.injector});
      customElements.define('md-robot', element);
    }
  }

}
