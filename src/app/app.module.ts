import { ViewportScroller } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Router, RouterModule, Scroll } from '@angular/router';
import { filter } from 'rxjs';
import { TutorialComponent } from 'src/app/tutorial/tutorial.component';
import { DiffCodeComponent } from 'src/app/diff-code/diff-code.component';
import { AppPlaceholderComponent } from 'src/app/placeholder/app-placeholder.component';
import { MakeCodeComponent } from 'src/app/make-code/make-code.component';
import { TimerComponent } from 'src/app/timer/timer.component';
import { GetAvatar } from 'src/pipes/avatar.pipe';
import { GetDepth } from 'src/pipes/depth.pipe';
import { GetMark, GetVoted } from 'src/pipes/mark.pipe';
import {
  GetSlugPipe,
  GetTokens,
  Md2Html,
  MdInline2Html
} from 'src/pipes/markdown.pipe';
import { MaximumPipe } from 'src/pipes/minimum.pipe';
import { TextWidthPipe } from 'src/pipes/text-width.pipe';
import { Token2Html } from 'src/pipes/token2html.pipe';
import { ChannelResolver } from 'src/resolvers/channel.resolver';
import { TutorialResolver } from 'src/resolvers/tutorial.resolver';
import { AgendaComponent } from './agenda/agenda.component';
import { AppComponent } from './app.component';
import { MermaidComponent } from './mermaid/mermaid.component';

export function routerErrorHandle(error: Error) {
  document.location.href = '/';
}

@NgModule({
  declarations: [
    AppComponent,
    TutorialComponent,
    TimerComponent,
    GetTokens,
    Token2Html,
    GetDepth,
    GetAvatar,
    GetMark,
    GetVoted,
    Md2Html,
    MdInline2Html,
    GetSlugPipe,
    TextWidthPipe,
    MaximumPipe,
    DiffCodeComponent,
    MermaidComponent,
    AgendaComponent,
    MakeCodeComponent,
    AppPlaceholderComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    RouterModule.forRoot([
      {
        path: ':channel',
        resolve: {
          channel: ChannelResolver,
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
      errorHandler: routerErrorHandle
    }),
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule {

  constructor(router: Router, viewportScroller: ViewportScroller) {
    viewportScroller.setOffset([0, 50]);
    router.events.pipe(filter(e => e instanceof Scroll))
      .subscribe(x => {
        const e = x as Scroll;
        if (!!e.anchor) {
          setTimeout(() => viewportScroller.scrollToAnchor(e.anchor as string));
        } else {
          viewportScroller.scrollToPosition([0, 0]);
        }
      });
  }

}
