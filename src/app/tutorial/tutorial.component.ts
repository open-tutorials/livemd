import {
  ChangeDetectorRef,
  Component,
  Injector,
  OnDestroy,
  OnInit,
  Renderer2
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { trimStart } from 'lodash';
import { marked } from 'marked';
import { Subscription } from 'rxjs';
import { ChannelManager } from 'src/managers/channel.manager';
import { HeapManager } from 'src/managers/heap.manager';
import { MeManager } from 'src/managers/me.manager';
import { Tutorial } from 'src/models/tutorial';
import { HeapsService } from 'src/services/heaps.service';
import { Heading } from 'src/types/heading';
import { getMarkedOptions, sendGoal } from 'src/utils';
import Slugger = marked.Slugger;

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss']
})
export class TutorialComponent implements OnInit, OnDestroy {

  me = this.meManager.me;
  channel = this.channelManager.channel;
  heap = this.heapManager.heap;

  tokens: any[] = [];
  headings: Heading[] = [];

  reached: { [key: string]: boolean } = {};
  subscriptions: { channel?: Subscription } = {};

  private _tutorial!: Tutorial;

  set tutorial(tutorial: Tutorial) {
    this._tutorial = tutorial;
    marked.setOptions(getMarkedOptions(tutorial.baseUrl, tutorial.assetsUrl));
    this.tokens = marked.lexer(tutorial.markdown as string);

    const headings: Heading[] = [];
    for (let i = 0; i < this.tokens.length; i++) {
      const t = this.tokens[i];
      if (t.type === 'heading' && t.text.startsWith('+')) {
        const heading = t as Heading;
        heading.text = trimStart(heading.text, '+');
        heading.line = i;
        headings.push(heading);
      }
    }
    this.headings = headings;

    this.title.setTitle(tutorial.title);
  }

  get tutorial() {
    return this._tutorial;
  }

  constructor(private cd: ChangeDetectorRef,
              private channelManager: ChannelManager,
              private heapManager: HeapManager,
              private heapService: HeapsService,
              private meManager: MeManager,
              private router: Router,
              private route: ActivatedRoute,
              private renderer: Renderer2,
              private injector: Injector,
              private title: Title) {

  }

  ngOnInit() {
    console.log('init tutorial');

    this.subscriptions.channel?.unsubscribe();
    this.subscriptions.channel = this.channelManager.updated
      .subscribe(() => this.cd.detectChanges());

    this.route.data.subscribe(({tutorial, channel, heap}) => {
      [this.tutorial, this.channel, this.heap] = [tutorial, channel, heap];

      sendGoal('open_' + tutorial.slug, {title: tutorial.title});

      const progress = this.heap.progress;
      if (progress === 0) {
        const next = this.findChapter(0);
        this.setProgress(next);
      } else if (progress < this.tokens.length - 1
        && this.tokens[progress].type !== 'hr') {
        const next = this.findChapter(progress);
        this.setProgress(next);
      }

    });

    this.route.fragment.subscribe(fragment => {
      const slugger = new Slugger();
      for (let line = 0; line < this.tokens.length; line++) {
        const token = this.tokens[line];
        if (token.type === 'heading') {
          const slug = slugger.slug(token.text);
          if (slug === fragment) {
            const next = this.findChapter(line);
            if (this.heap.progress < next) {
              this.setProgress(next);
            }
            break;
          }
        }
      }
    });
  }

  ngOnDestroy() {
    this.channelManager.leave();
    this.subscriptions.channel?.unsubscribe();
  }

  resetProgress() {
    this.setProgress(0);
    this.router.navigate([]);
  }

  open(line: number) {
    this.heapManager.put({opened: line});
    this.cd.detectChanges();
  }

  setProgress(line: number) {
    const total = this.tokens.length - 1;
    const chapter = this.findHeader(line) || 'end';
    if (!this.reached[chapter]) {
      console.log(chapter);
      sendGoal('set_progress', {
        tutorial: this.tutorial.title,
        chapter: chapter,
        progress: line,
        total
      });
      this.reached[chapter] = true;
    }
    this.heapManager.put({progress: line, total});
    this.cd.detectChanges();
  }

  private findHeader(line: number) {
    const from = line + 1;
    const header = this.tokens.slice(0, from).reverse()
      .find(t => t.type === 'heading' && t.depth <= 2);
    return !!header ? header.text : null;
  }

  findChapter(line: number) {
    const from = line + 1;
    const next = this.tokens.slice(from)
      .findIndex(t => t.type === 'hr');
    return next !== -1 ? from + next : this.tokens.length - 1;
  }

}
