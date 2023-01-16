import { ChangeDetectorRef, Component, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { marked } from 'marked';
import { ChannelManager } from 'src/managers/channel.manager';
import { MeManager } from 'src/managers/me.manager';

@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class PollComponent {

  me = this.meManager.me;

  channel = this.channelManager.channel;
  private _id!: string;

  tokens: any[] = [];
  message!: string;

  indexes = new Map<object, number>();

  answerControl = this.fb.control(null, [Validators.required]);
  form = this.fb.group({
    answer: this.answerControl
  });

  @Input()
  set id(id: string) {
    this._id = id;
    const answer = this.channel.polls?.[id]?.voted[this.me.id];
    if (answer !== undefined) {
      this.form.setValue({answer});
    }
  }

  get id() {
    return this._id;
  }

  @Input()
  set config(config: string) {
    const [question, message] = config.split(/\n\n\n(.*)/s);
    this.message = message;

    this.tokens = marked.lexer(question);
    let i = 0;
    for (const t of this.tokens) {
      if (t.type === 'list') {
        for (const item of t.items) {
          this.indexes.set(item, i);
          i++;
        }
      }
    }
  }

  @Input()
  orientation: string = 'vertical';

  constructor(private channelManager: ChannelManager,
              private meManager: MeManager,
              private fb: FormBuilder,
              private cd: ChangeDetectorRef) {
  }

  vote() {
    const {answer} = this.form.getRawValue();
    this.channelManager.votePoll(this.id, answer)
      .subscribe(() => console.log('voted'));
    this.cd.detectChanges();
  }

}
