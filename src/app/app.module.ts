import { ViewportScroller } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Router, RouterModule, Scroll } from '@angular/router';
import { filter } from 'rxjs';
import { CircleComponent } from 'src/app/circle/circle.component';
import { DiffCodeComponent } from 'src/app/diff-code/diff-code.component';
import { EditorPreviewComponent } from 'src/app/editor-preview/editor-preview.component';
import { HowToComponent } from 'src/app/how-to/how-to.component';
import { LinkComponent } from 'src/app/link/link.component';
import { MakeCodeComponent } from 'src/app/make-code/make-code.component';
import { MessageComponent } from 'src/app/message/message.component';
import { AppPlaceholderComponent } from 'src/app/placeholder/app-placeholder.component';
import { QuizComponent } from 'src/app/quiz/quiz.component';
import { RobotComponent } from 'src/app/robot/robot.component';
import { TimerComponent } from 'src/app/timer/timer.component';
import { TutorialComponent } from 'src/app/tutorial/tutorial.component';
import { NgLetDirective } from 'src/directives/let.directive';
import { GetAvatar } from 'src/pipes/avatar.pipe';
import { GetDepth } from 'src/pipes/depth.pipe';
import { SafePipe } from 'src/pipes/html.pipe';
import { IncludePipe } from 'src/pipes/include';
import { GetFromMapPipe } from 'src/pipes/map.pipe';
import {
  GetSlugPipe,
  GetTokens,
  InterpolatePipe,
  Md2Html,
  MdInline2HtmlPipe
} from 'src/pipes/markdown.pipe';
import { MaximumPipe } from 'src/pipes/minimum.pipe';
import { TextWidthPipe } from 'src/pipes/text-width.pipe';
import { Token2Html } from 'src/pipes/token2html.pipe';
import { TypePipe } from 'src/pipes/type.pipe';
import { ChannelResolver, FakeChannelResolver } from 'src/resolvers/channel.resolver';
import { FakeHeapResolver, HeapResolver } from 'src/resolvers/heap.resolver';
import { PreviewTutorialResolver, TutorialResolver } from 'src/resolvers/tutorial.resolver';
import { AgendaComponent } from './agenda/agenda.component';
import { AppComponent } from './app.component';
import { EditorComponent } from './editor/editor.component';
import { MermaidComponent } from './mermaid/mermaid.component';
import { MonacoEditorComponent } from './monaco-editor/monaco-editor.component';
import { ProgressComponent } from './progress/progress.component';
import { TemplateComponent } from './template/template.component';
import { HiddenComponent } from './hidden/hidden.component';
import { PollComponent } from './poll/poll.component';

export function routerErrorHandle(error: Error) {
  console.error(error);
  document.location.href = '/';
}

@NgModule({
  declarations: [
    NgLetDirective,
    AppComponent,
    TutorialComponent,
    TimerComponent,
    GetTokens,
    Token2Html,
    GetDepth,
    GetAvatar,
    Md2Html,
    MdInline2HtmlPipe,
    GetSlugPipe,
    TextWidthPipe,
    MaximumPipe,
    InterpolatePipe,
    GetFromMapPipe,
    DiffCodeComponent,
    MermaidComponent,
    AgendaComponent,
    MakeCodeComponent,
    AppPlaceholderComponent,
    RobotComponent,
    AppPlaceholderComponent,
    MessageComponent,
    IncludePipe,
    CircleComponent,
    HowToComponent,
    ProgressComponent,
    MonacoEditorComponent,
    EditorComponent,
    EditorPreviewComponent,
    QuizComponent,
    LinkComponent,
    SafePipe,
    TypePipe,
    TemplateComponent,
    HiddenComponent,
    PollComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    RouterModule.forRoot([
      {
        path: '',
        pathMatch: 'full',
        resolve: {
          channel: ChannelResolver,
          heap: HeapResolver,
          tutorial: TutorialResolver
        },
        component: TutorialComponent
      },
      {
        path: 'editor',
        children: [
          {
            path: '',
            pathMatch: 'full',
            component: EditorComponent
          },
          {
            path: 'preview',
            component: EditorPreviewComponent,
            children: [
              {
                path: '',
                pathMatch: 'full',
                resolve: {
                  channel: ChannelResolver,
                  heap: FakeHeapResolver,
                  tutorial: PreviewTutorialResolver
                },
                component: TutorialComponent
              }
            ]
          }
        ]
      },
      {
        path: ':tutorial',
        resolve: {
          channel: ChannelResolver,
          heap: HeapResolver,
          tutorial: TutorialResolver
        },
        component: TutorialComponent
      },
      {
        path: ':channel/join',
        redirectTo: '/:channel'
      }
    ], {
      scrollPositionRestoration: 'disabled',
      anchorScrolling: 'disabled',
      scrollOffset: [0, 50],
      initialNavigation: 'enabled',
      paramsInheritanceStrategy: 'always',
      errorHandler: routerErrorHandle
    }),
    ReactiveFormsModule
  ],
  bootstrap: [
    AppComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule {

  timer: any;

  constructor(router: Router, viewportScroller: ViewportScroller) {
    viewportScroller.setOffset([0, 50]);
    router.events.pipe(filter(e => e instanceof Scroll))
      .subscribe(x => {
        const e = x as Scroll;
        if (!!e.anchor) {
          clearTimeout(this.timer);
          this.timer = setTimeout(() => viewportScroller.scrollToAnchor(e.anchor as string));
        } else {
          viewportScroller.scrollToPosition([0, 0]);
        }
      });
  }

}
