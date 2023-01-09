import { ChangeDetectorRef, Component, Injector, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { trimStart } from 'lodash';
import { marked } from 'marked';
import { environment } from 'src/environments/environment';
import { ChannelManager } from 'src/managers/channel.manager';
import { HeapManager } from 'src/managers/heap.manager';
import { MeManager } from 'src/managers/me.manager';
import { Channel } from 'src/models/channel';
import { Heap } from 'src/models/heap';
import { Member } from 'src/models/member';
import { Tutorial } from 'src/models/tutorial';
import { HeapsService } from 'src/services/heaps.service';
import { Heading } from 'src/types/heading';
import { getMarkedOptions } from 'src/utils';
import Slugger = marked.Slugger;

declare var Pusher: any;

type VotePollEvent = { member: string, line: number, option: number };
type MemberUpdatedEvent = { member: Member };

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss']
})
export class TutorialComponent implements OnInit {

  me = this.meManager.me;
  form = this.fb.group({});
  pusher: { public?: any, private?: any } = {};
  tokens: any[] = [];
  headings: Heading[] = [];
  current = this.me.id;
  state: { comments: { [key: number]: boolean } } = {comments: {}};

  private _tutorial!: Tutorial;
  private _channel: Channel = this.channelManager.channel;
  heap: Heap = this.heapManager.heap;

  set channel(channel: Channel) {
    this._channel = channel;

    this.bindEvents();
  }

  get channel() {
    return this._channel;
  }

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

    const title = this.tokens.find(t => t.type === 'heading');
    if (!!title) {
      this.title.setTitle(title.text);
    }
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
              private title: Title,
              private fb: FormBuilder) {

  }

  ngOnInit() {
    console.log('init tutorial');
    this.route.data.subscribe(({tutorial, channel, heap}) => {
      [this.tutorial, this.channel, this.heap] = [tutorial, channel, heap];

      const progress = this.heap.progress || 0;
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

  resetProgress() {
    this.setProgress(0);
    this.router.navigate([]);
  }

  open(line: number) {
    this.heapManager.put({opened: line});
    this.cd.detectChanges();
  }

  setProgress(line: number) {
    this.heapManager.put({progress: line, total: this.tokens.length - 1});
    this.cd.detectChanges();
  }

  votePoll(line: number, option: number) {
    if (!this.channel.polls[this.me.id]) {
      this.channel.polls[this.me.id] = {};
    }

    this.channel.polls[this.me.id][line] = option;
    this.cd.detectChanges();

    this.channelManager.votePoll(line, option)
      .subscribe(response => console.log(response));
  }

  findChapter(line: number) {
    const from = line + 1;
    const next = this.tokens.slice(from)
      .findIndex(t => t.type === 'hr');
    return next !== -1 ? from + next : this.tokens.length - 1;
  }

  private bindEvents() {
    const pusher = new Pusher('4fb08c17a97f4b75ef66', {
      cluster: 'eu',
      authEndpoint: [environment.backend, 'channels', this.channel.id, 'auth'].join('/'),
      auth: {
        params: {
          member: this.me.id
        }
      }
    });

    {
      const channel = pusher.subscribe(this.channel.id);
      this.pusher.public = channel;

      channel.bind('vote_poll', ({member, line, option}: VotePollEvent) => {
        if (member === this.me.id) {
          return;
        }
        this.channel.polls[member][line] = option;
        this.cd.detectChanges();
      });

      channel.bind('member_updated', ({member: {id, name, avatar}}: MemberUpdatedEvent) => {
        const member = this.channel.members[id];
        Object.assign(member, {name, avatar});
        this.cd.detectChanges();
      });
    }

    {
      const channel = pusher.subscribe(['private', this.channel.id].join('-'));
      this.pusher.private = channel;
    }

  }

}
