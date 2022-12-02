import { Component, ElementRef, HostBinding, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';

const MIN_WIDTH = 20;
const CHAR_WIDTH = 10;

@Component({
  selector: 'app-placeholder',
  templateUrl: './app-placeholder.component.html',
  styleUrls: ['./app-placeholder.component.scss']
})
export class AppPlaceholderComponent implements OnInit {

  @ViewChild('inputRef', {read: ElementRef, static: false})
  input!: ElementRef<HTMLInputElement>;

  @Input()
  value!: string;

  @HostBinding('attr.data-answer')
  answer!: boolean | undefined;

  answerControl = this.fb.control(null);
  form = this.fb.group({
    answer: this.answerControl
  });

  constructor(private fb: FormBuilder,
              private renderer: Renderer2) {
  }

  ngOnInit() {
    this.answerControl.valueChanges.
      subscribe((value: string | null) => {
        const inputRef = this.input.nativeElement;
        if (!!value && value.length > 0) {
          const width = Math.max((value.length + 1) * CHAR_WIDTH, MIN_WIDTH);
          this.renderer.setStyle(inputRef, 'width', width + 'px');
        } else {
          this.renderer.removeStyle(inputRef, 'width');
          this.answer = undefined;
        }
      });
  }

  check() {
    if (!!this.answerControl.value) {
      this.answer = this.answerControl.value === this.value;
    } else {
      this.answer = undefined;
    }
  }

  help() {
    this.answerControl.setValue(this.value);
    this.answer = true;
  }
}
