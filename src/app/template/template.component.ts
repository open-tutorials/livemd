import { Component, Input, OnInit } from '@angular/core';
import { template, forEach, merge } from 'lodash';

@Component({
  selector: 'md-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent {

  render!: string;

  @Input()
  set html(html: string) {
    const [source, json] = html.split(/\n\n\n/);
    const compile = template(source);
    const data = {forEach};
    merge(data, JSON.parse(json));
    this.render = compile(data);
  }

}
