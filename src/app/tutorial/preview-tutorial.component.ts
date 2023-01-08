import { Component } from '@angular/core';
import { TutorialComponent } from 'src/app/tutorial/tutorial.component';
import { FakeHeapService, HeapService } from 'src/services/heap.service';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss'],
  providers: [{
    provide: HeapService,
    useClass: FakeHeapService
  }]
})
export class PreviewTutorialComponent extends TutorialComponent {

}
