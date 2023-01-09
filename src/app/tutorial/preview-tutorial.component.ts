import { Component } from '@angular/core';
import { TutorialComponent } from 'src/app/tutorial/tutorial.component';
import { FakeHeapManager, HeapManager } from 'src/managers/heap.manager';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss'],
  providers: [{
    provide: HeapManager,
    useClass: FakeHeapManager
  }]
})
export class PreviewTutorialComponent extends TutorialComponent {

}
