import { EventEmitter, Injectable } from '@angular/core';

export type TimerStartedEvent = {
  id: number
  type: 'started',
  time: string
};

export type TimerStoppedEvent = {
  id: number
  type: 'stopped',
  time: string
};

export type TimerEvent = TimerStartedEvent | TimerStoppedEvent;

@Injectable({providedIn: 'root'})
export class TimerEvents {

  broadcast$ = new EventEmitter<TimerEvent>();

  dispatch(event: TimerEvent) {
    this.broadcast$.emit(event);
  }

}
