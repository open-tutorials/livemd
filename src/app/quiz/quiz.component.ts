import {
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  Pipe, PipeTransform,
  ViewEncapsulation
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { marked } from 'marked';
import { HeapManager } from 'src/managers/heap.manager';

@Pipe({name: 'getSelectedAnswers'})
export class GetSelectedAnswersPipePipe implements PipeTransform {

  transform(arr: boolean[]): number[] {
    const selected = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i]) {
        selected.push(i);
      }
    }
    return selected;
  }

}

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class QuizComponent {

  heap = this.heapManager.heap;

  tokens: any[] = [];
  right: number[] = [];
  message!: string;

  indexes = new Map<object, number>();

  answersControl = this.fb.array([]);
  form = this.fb.group({
    answers: this.answersControl
  });

  @Input()
  id!: string;

  @Input()
  set config(config: string) {
    const [question, message] = config.split(/\n\n\n(.*)/s);
    this.message = message;

    this.tokens = marked.lexer(question);
    let i = 0;
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

    const answers = this.heap.quizzes?.[this.id];
    if (!!answers) {
      for (const a of answers) {
        this.answersControl.at(a).setValue(true);
      }
    }
  }

  @Input()
  orientation: string = 'vertical';

  constructor(private heapManager: HeapManager,
              private fb: FormBuilder,
              private cd: ChangeDetectorRef) {
  }

  check() {
    const answers = this.answersControl.getRawValue()
      .map((answer, index) => !!answer ? index : null)
      .filter(index => index !== null) as number[];
    this.heapManager.put({quizzes: {[this.id]: answers}});

    this.cd.detectChanges();
  }

}
