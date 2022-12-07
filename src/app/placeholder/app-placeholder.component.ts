import {
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
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

  private heap = this.heapService.heap;

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
    return this.answerControl.value === this.value;
  }

  @HostBinding('attr.data-dirty')
  get dirty() {
    return this.answerControl.dirty;
  }

  answerControl = this.fb.control(null);

  constructor(private heapService: HeapService,
              private fb: FormBuilder,
              private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.answerControl.valueChanges.subscribe((value: string | null) => {
      this.heapService.put({placeholders: {[this._hash]: value || ''}});
      this.cd.detectChanges();
    });
  }

  help() {
    this.answerControl.setValue(this.value);
  }

}
