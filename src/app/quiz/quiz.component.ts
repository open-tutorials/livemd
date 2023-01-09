import {
  ChangeDetectorRef,
  Component,
  Input,
  ViewEncapsulation
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { marked } from 'marked';
import { difference } from 'lodash';
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
  wrong: any[] = [];
  right: any[] = [];
  accepted = false;

  answersControl = this.fb.array([]);
  form = this.fb.group({
    answers: this.answersControl
  });

  @Input() set id(id: string) {
    this._id = id;
    this.accepted = !!this.heap.quizes?.[id];
  }

  get id() {
    return this._id;
  }

  @Input()
  set config(config: string) {
    this.tokens = marked.lexer(config as string);
    for (let i = 0; i < this.tokens.length; i++) {
      const t = this.tokens[i];
      if (t.type === 'list') {
        for (let j = 0; j < t.items.length; j++) {
          const item = t.items[j];
          this.answersControl.push(this.fb.control(null));
          if (item.type === 'list_item' && item.task && item.checked) {
            this.answers.push(j);
          }
        }
      }
    }
  }

  constructor(private heapManager: HeapManager,
              private fb: FormBuilder,
              private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    if (this.accepted) {
      this.wrong = difference(this.heap.quizes[this.id], this.answers);
      this.right = difference(this.heap.quizes[this.id], this.wrong);
    }
  }

  check() {
    let answers: any[];
    answers = this.answersControl.getRawValue()
      .map((answer, index) => !!answer ? index : null)
      .filter(index => !!index || index === 0);
    this.cd.detectChanges();

    this.wrong = difference(answers, this.answers);
    this.right = difference(answers, this.wrong);

    this.heapManager.put({quizes: {[this.id]: answers}});
    this.accepted = !!this.heap.quizes?.[this.id];
  }

}
