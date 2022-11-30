import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { marked } from 'marked';
import Token = marked.Token;

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss']
})
export class AgendaComponent {

  @Input()
  tokens!: Token[];

  @Input()
  progress!: Number;

  @Output()
  block = new EventEmitter();

}
