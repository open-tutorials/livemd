import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'getFromMap'})
export class GetFromMapPipe implements PipeTransform {

  transform(key: Object, map: Map<Object, number>): number {
    return map.get(key) as number;
  }

}
