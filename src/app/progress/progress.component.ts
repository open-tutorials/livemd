import { ChangeDetectorRef, Component, HostBinding, Input, OnInit } from '@angular/core';
import { Heap } from 'src/models/heap';
import { HeapService } from 'src/services/heap.service';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit {

  @Input('for')
  channel!: string;

  heap!: Heap;

  @HostBinding('attr.has-progress')
  get progress() {
    return this.heap?.progress > 0;
  }

  constructor(private heapService: HeapService,
              private cd: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.heapService.get(this.channel)
      .subscribe(heap => {
        this.heap = heap;
        this.cd.detectChanges();
      });
  }

  get done(): number {
    return Math.round((this.heap?.progress / this.heap?.total) * 100);
  }

}
