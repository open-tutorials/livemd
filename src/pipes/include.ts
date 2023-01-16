import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'include'})
export class IncludePipe implements PipeTransform {

  transform(arr: any[] | undefined, obj: any): boolean {
    return !!arr ? arr.includes(obj) : false;
  }

}
