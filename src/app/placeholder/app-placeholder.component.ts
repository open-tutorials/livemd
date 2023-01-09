import {
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { trim } from 'lodash';
import { HeapManager } from 'src/managers/heap.manager';
import { HeapService } from 'src/services/heap.service';
import { Md5 } from 'ts-md5';

@Component({
  selector: 'app-placeholder',
  templateUrl: './app-placeholder.component.html',
  styleUrls: ['./app-placeholder.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class AppPlaceholderComponent implements OnInit {

  private _value!: string;
  private _hash!: string;

  private heap = this.heapManager.heap;

  @Input()
  context!: string;

  @Input()
  set value(value: string) {
    this._value = value;
    this._hash = Md5.hashStr([this.context, value].join('_'));
    this.answerControl.setValue(this.heap.placeholders?.[this._hash] || null, {emitEvent: false});
  }

  get value() {
    return this._value;
  }

  @HostBinding('attr.data-right')
  get right() {
    return trim(this.answerControl.value) === this.value;
  }

  @HostBinding('attr.data-dirty')
  get dirty() {
    return this.answerControl.dirty;
  }

  answerControl = this.fb.control(null);

  constructor(private heapManager: HeapManager,
              private fb: FormBuilder,
              private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.answerControl.valueChanges.subscribe((value: string | null) => {
      this.heapManager.put({placeholders: {[this._hash]: value || ''}});
      this.cd.detectChanges();
    });
  }

  help() {
    this.answerControl.setValue(this.value);
  }

}
