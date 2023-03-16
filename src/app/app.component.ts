import { Component, Injector, OnInit } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { CircleComponent } from 'src/app/circle/circle.component';
import { DiffCodeComponent } from 'src/app/diff-code/diff-code.component';
import { HiddenComponent } from 'src/app/hidden/hidden.component';
import { HowToComponent } from 'src/app/how-to/how-to.component';
import { LinkComponent } from 'src/app/link/link.component';
import { MessageComponent } from 'src/app/message/message.component';
import { AppPlaceholderComponent } from 'src/app/placeholder/app-placeholder.component';
import { MakeCodeComponent } from 'src/app/make-code/make-code.component';
import { MermaidComponent } from 'src/app/mermaid/mermaid.component';
import { PollComponent } from 'src/app/poll/poll.component';
import { ProgressComponent } from 'src/app/progress/progress.component';
import { QuizComponent } from 'src/app/quiz/quiz.component';
import { RobotComponent } from 'src/app/robot/robot.component';
import { TemplateComponent } from 'src/app/template/template.component';
import { sendHit } from 'src/utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private injector: Injector,
              private router: Router) {
  }

  ngOnInit() {

    this.router.events.pipe(filter(t => t instanceof NavigationEnd))
      .subscribe(e => {
        try {
          sendHit((e as NavigationEnd).urlAfterRedirects);
        } catch (e) {
          console.error(e);
        }
      });

    if (!customElements.get('md-hidden')) {
      const element = createCustomElement(HiddenComponent, {injector: this.injector});
      customElements.define('md-hidden', element);
    }

    if (!customElements.get('md-template')) {
      const element = createCustomElement(TemplateComponent, {injector: this.injector});
      customElements.define('md-template', element);
    }

    if (!customElements.get('md-link')) {
      const element = createCustomElement(LinkComponent, {injector: this.injector});
      customElements.define('md-link', element);
    }

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

    if (!customElements.get('md-circle')) {
      const element = createCustomElement(CircleComponent, {injector: this.injector});
      customElements.define('md-circle', element);
    }

    if (!customElements.get('md-how-to')) {
      const element = createCustomElement(HowToComponent, {injector: this.injector});
      customElements.define('md-how-to', element);
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

    if (!customElements.get('md-poll')) {
      const element = createCustomElement(PollComponent, {injector: this.injector});
      customElements.define('md-poll', element);
    }

    if (!customElements.get('md-quiz')) {
      const element = createCustomElement(QuizComponent, {injector: this.injector});
      customElements.define('md-quiz', element);
    }

    if (!customElements.get('md-progress')) {
      const element = createCustomElement(ProgressComponent, {injector: this.injector});
      customElements.define('md-progress', element);
    }
  }

}
