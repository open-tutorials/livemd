import { HttpClientModule } from '@angular/common/http';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ChannelComponent } from 'src/app/channel/channel.component';
import { CreateChannelComponent } from 'src/app/create/create.component';
import { DiffCodeComponent } from 'src/app/diff-code/diff-code.component';
import { TimerComponent } from 'src/app/timer/timer.component';
import { WelcomeComponent } from 'src/app/welcome/welcome.component';
import { GetAvatar } from 'src/pipes/avatar.pipe';
import { GetDepth } from 'src/pipes/depth.pipe';
import { GetMark, GetVoted } from 'src/pipes/mark.pipe';
import {
  GetAgendaPipe,
  GetSlugPipe,
  GetTokens,
  Md2Html,
  MdInline2Html
} from 'src/pipes/markdown.pipe';
import { Token2Html } from 'src/pipes/token2html.pipe';
import { ChannelResolver } from 'src/resolvers/channel.resolver';
import { AgendaComponent } from './agenda/agenda.component';
import { AppComponent } from './app.component';
import { MermaidComponent } from './mermaid/mermaid.component';

export function routerErrorHandle(error: Error) {
  document.location.href = '/';
}

@NgModule({
  declarations: [
    AppComponent,
    CreateChannelComponent,
    WelcomeComponent,
    ChannelComponent,
    TimerComponent,
    GetTokens,
    Token2Html,
    GetDepth,
    GetAvatar,
    GetMark,
    GetVoted,
    Md2Html,
    MdInline2Html,
    GetAgendaPipe,
    GetSlugPipe,
    DiffCodeComponent,
    MermaidComponent,
    AgendaComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    RouterModule.forRoot([
      {
        path: ':channel',
        resolve: {
          channel: ChannelResolver
        },
        component: ChannelComponent
      },
      {
        path: '',
        pathMatch: 'full',
        component: CreateChannelComponent
      }
    ], {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
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

}
