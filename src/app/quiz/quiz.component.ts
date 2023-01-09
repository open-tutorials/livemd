import { ChangeDetectorRef, Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { marked } from 'marked';
import { HeapManager } from 'src/managers/heap.manager';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class QuizComponent {

  heap = this.heapManager.heap;
  private _id!: string;

  tokens: any[] = [];
  answers: number[] = [];
  right: number[] = [];
  message!: string;

  indexes = new Map<object, number>();

  answersControl = this.fb.array([]);
  form = this.fb.group({
    answers: this.answersControl
  });

  @Input()
  set id(id: string) {
    this._id = id;
    this.answers = this.heap.quizzes?.[id];
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
    console.log(this.tokens);
    for (const t of this.tokens) {
      if (t.type === 'list') {
        for (const item of t.items) {
          this.answersControl.push(this.fb.control(false));
          if (item.type === 'list_item' && item.task && item.checked) {
            this.right.push(i);
          }
          this.indexes.set(item, i);
          i++;
        }
      }
    }

    if (!!this.answers) {
      for (const a of this.answers) {
        this.answersControl.at(a).setValue(true);
      }
    }
  }

  @Input()
  orientation!: string;

  constructor(private heapManager: HeapManager,
              private fb: FormBuilder,
              private cd: ChangeDetectorRef) {
  }

  check() {
    this.answers = this.answersControl.getRawValue()
      .map((answer, index) => !!answer ? index : null)
      .filter(index => index !== null) as number[];
    this.cd.detectChanges();

    this.heapManager.put({quizzes: {[this.id]: this.answers}});
  }

}
