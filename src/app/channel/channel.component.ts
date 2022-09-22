import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef, HostBinding,
  OnInit,
  QueryList,
  Renderer2,
  ViewChildren
} from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { marked } from 'marked';
import { debounceTime, Subject, tap } from 'rxjs';
import { TimerEvent, TimerEvents } from 'src/app/timer/timer-events.service';
import { environment } from 'src/environments/environment';
import { MeManager } from 'src/managers/me.manager';
import { Channel } from 'src/models/channel';
import { Member } from 'src/models/member';
import { ChannelsService } from 'src/services/channels.service';
import { getMarkedOptions } from 'src/utils';

declare var Pusher: any;

export enum Mode {
  member = 'member',
  owner = 'owner'
}

type PutMarkEvent = { member: string, line: number, mark: string };
type VotePollEvent = { member: string, line: number, option: number };
type PutCommentEvent = { member: string, line: number, comment: string };
type SetProgressEvent = { member: string, line: number };
type MemberJoinedEvent = { member: Member };
type MemberUpdatedEvent = { member: Member };

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit, AfterViewInit {

  consts = {baseUrl: environment.baseUrl};

  @HostBinding('attr.data-mode')
  get mode(): Mode {
    return this.channel?.owner === this.me?.id ? Mode.owner : Mode.member;
  }

  me = this.meManager.me;
  form = this.fb.group({});
  pusher: { public?: any, private?: any } = {};
  tokens: any[] = [];

  private _channel!: Channel;

  set channel(channel: Channel) {
    this._channel = channel;
    this.tokens = marked.lexer(channel.markdown);
    marked.setOptions(getMarkedOptions(channel.baseUrl, channel.imagesUrl));
    this.bindEvents();
  }

  get channel() {
    return this._channel;
  }

  @ViewChildren('pointerRef')
  pointerRefs!: QueryList<ElementRef<HTMLDivElement>>;

  constructor(private cd: ChangeDetectorRef,
              private channelsService: ChannelsService,
              private meManager: MeManager,
              private events: TimerEvents,
              private route: ActivatedRoute,
              private renderer: Renderer2,
              private fb: FormBuilder) {

  }

  ngOnInit() {
    this.route.data.subscribe(({channel}) =>
      this.channel = channel);
  }

  ngAfterViewInit() {
    this.pointerRefs.changes.subscribe(refs => {
      // console.log(refs);
    });

    setInterval(() => {
      const refs = this.pointerRefs.toArray();
    }, 500);
  }

  putMark(line: number, mark: string | null) {
    this.channel.marks[this.me.id][line] = mark;

    this.channelsService.mark(this.channel.id, line, mark)
      .subscribe(response => console.log(response));
  }

  getCommentControl(line: number): FormControl {
    const name = line.toString();
    let control = this.form.get(name) as FormControl;
    if (!control) {
      control = this.fb.control((this.channel.comments[line] || {})[this.me.id] || null);
      control.valueChanges.subscribe(comment =>
        this.putComment(line, comment));
      this.form.addControl(name, control);
    }
    return control;
  }

  putComment(line: number, comment: string) {
    if (!this.channel.comments[line]) {
      this.channel.comments[line] = {};
    }

    const {id} = this.me;
    if (!!comment) {
      this.channel.comments[line][id] = comment;
    } else {
      delete this.channel.comments[line][id];
    }

    this.channelsService.comment(this.channel.id, line, comment || null)
      .subscribe(response => console.log(response));
  }

  setProgress(line: number) {
    this.channel.progress[this.me.id] = line;

    this.channelsService.progress(this.channel.id, line)
      .subscribe(response => console.log(response));
  }

  votePoll(line: number, option: number) {
    if (!this.channel.polls[this.me.id]) {
      this.channel.polls[this.me.id] = {};
    }

    this.channel.polls[this.me.id][line] = option;

    this.channelsService.votePoll(this.channel.id, line, option)
      .subscribe(response => console.log(response));
  }

  findChapter(line: number) {
    const from = line + 1;
    const next = this.tokens.slice(from)
      .findIndex(t => t.type == 'hr');
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

      channel.bind('put_mark', ({member, line, mark}: PutMarkEvent) => {
        if (member === this.me.id) {
          return;
        }
        this.channel.marks[member][line] = mark;
        this.cd.detectChanges();
      });

      channel.bind('vote_poll', ({member, line, option}: VotePollEvent) => {
        if (member === this.me.id) {
          return;
        }
        this.channel.polls[member][line] = option;
        this.cd.detectChanges();
      });

      channel.bind('put_comment', ({member, line, comment}: PutCommentEvent) => {
        if (member === this.me.id) {
          return;
        }
        if (!this.channel.comments[line]) {
          this.channel.comments[line] = {};
        }
        if (!!comment) {
          this.channel.comments[line][member] = comment;
        } else {
          delete this.channel.comments[line][member];
        }
        this.cd.detectChanges();
      });

      channel.bind('set_progress', ({member, line}: SetProgressEvent) => {
        if (member === this.me.id) {
          return;
        }

        if (member === this.channel.owner && this.channel.progress[this.me.id] > line) {
          this.channel.progress[this.me.id] = line;
        }

        this.channel.progress[member] = line;
        this.cd.detectChanges();
      });

      channel.bind('member_joined', ({member}: MemberJoinedEvent) => {
        this.channel.members[member.id] = member;
        if (!this.channel.marks[member.id]) {
          this.channel.marks[member.id] = {};
        }
        if (!this.channel.polls[member.id]) {
          this.channel.polls[member.id] = {};
        }
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
      if (this.me.id !== this.channel.owner) {
        channel.bind('client-timers', ({id, type, time}: TimerEvent) =>
          this.events.dispatch({id, type, time}));
      }
    }

  }

  startTimer(id: number, time: string) {
    this.pusher.private?.trigger('client-timers', {id, type: 'started', time});
  }

  stopTimer(id: number, time: string) {
    this.pusher.private?.trigger('client-timers', {id, type: 'stopped', time});
  }

}
