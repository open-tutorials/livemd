import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { merge } from 'lodash';
import { delay, finalize } from 'rxjs/operators';
import { deserialize } from 'serialize-ts';
import { HeapManager } from 'src/managers/heap.manager';
import { Robot } from 'src/models/robot';
import { RobotAnswer } from 'src/models/robot-answer';

@Component({
  selector: 'app-robot',
  templateUrl: './robot.component.html',
  styleUrls: ['./robot.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RobotComponent {

  calling!: boolean;
  error!: string;
  answer!: RobotAnswer;
  robot!: Robot;

  heap = this.heapManager.heap;

  @Input()
  id!: string;

  @Input()
  set config(config: string) {
    this.robot = deserialize(JSON.parse(config), Robot);
    if (!!this.robot) {
      for (const f of this.robot.fields) {
        const control = this.fb.control(null, [Validators.required]);
        this.form.addControl(f.name, control);
      }
    }
  }

  form = this.fb.group({});

  constructor(private http: HttpClient,
              private fb: FormBuilder,
              private cd: ChangeDetectorRef,
              private heapManager: HeapManager) {
  }

  call() {
    if (this.form.valid) {
      this.calling = true;
      this.cd.detectChanges();
      const scope = merge(this.heapManager.heap?.robots?.scope, this.form.getRawValue());
      this.http.post<RobotAnswer>(this.robot.endpoint, scope)
        .pipe(delay(1000), finalize(() => {
          this.calling = false;
          this.cd.detectChanges();
        }))
        .subscribe(answer => {
            this.answer = answer;
            this.heapManager.put({
              robots: {
                messages: {[this.id]: this.answer.message},
                scope: {[this.id]: this.answer.scope}
              }
            });
          },
          ({error}) => this.error = error);
    }
  }

}
