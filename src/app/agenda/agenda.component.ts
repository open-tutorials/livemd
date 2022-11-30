import { Component, Input, OnInit } from '@angular/core';
import { marked } from 'marked';
import Token = marked.Token;

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss']
})
export class AgendaComponent implements OnInit {

  @Input()
  tokens!: Token[];

  constructor() {
  }

  ngOnInit(): void {
  }

}
