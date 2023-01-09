import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-md-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss']
})
export class LinkComponent {

  @Input()
  href!: string;

  @Input()
  title!: string;

}
