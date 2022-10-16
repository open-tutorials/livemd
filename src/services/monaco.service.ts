import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MonacoService {
  loaded: boolean = false;

  public ready: Subject<void> = new Subject<void>();

  constructor() {
  }

  private finishLoading() {
    this.loaded = true;
    this.ready.next();
  }

  public load() {
    // load the assets
    const baseUrl = './assets/monaco-editor/min/vs';

    if (typeof (<any>window).monaco === 'object') {
      this.finishLoading();
      return;
    }

    const onGotAmdLoader: any = () => {
      // load Monaco
      (<any>window).require.config({paths: {vs: `${baseUrl}`}});
      (<any>window).require([`vs/editor/editor.main`], () => {
        this.finishLoading();
      });
    };

    // load AMD loader, if necessary
    if (!(<any>window).require) {
      const script: HTMLScriptElement = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `${baseUrl}/loader.js`;
      script.addEventListener('load', onGotAmdLoader);
      document.body.appendChild(script);
    } else {
      onGotAmdLoader();
    }
  }
}
