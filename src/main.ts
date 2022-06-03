import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import hljs from 'highlight.js';
import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import { marked } from 'marked';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('css', css);

marked.setOptions({
  highlight: function (code, lang) {
    return hljs.highlight(lang, code).value;
  }
});

// @ts-ignore-start
const details: any = {
  name: 'details',
  level: 'block',
  start(src: string) {
    return src.match(/^<details>/)?.index;
  },
  tokenizer(src: string, tokens: any[]): any {
    const rule = /^<details>(((?!<details>)(?:.|\n))+)<\/details>/;
    const match = rule.exec(src);
    if (match) {
      let [raw, text] = match;
      text = text.trim();
      const token = {
        type: 'details',
        raw: raw,
        text: text.trim(),
        tokens: this.lexer.blockTokens(text)
      };
      return token;
    }
  },
  renderer(token: any) {
    return `<details>${this.parser.parse(token.tokens)}</details>`;
  }
};

const summary: any = {
  name: 'summary',
  level: 'block',
  start(src: string) {
    return src.match(/^<summary>/)?.index;
  },
  tokenizer(src: string, tokens: any[]): any {
    const rule = /^<summary>(((?!<summary>)(?:.|\n))+)<\/summary>/;
    const match = rule.exec(src);
    if (match) {
      let [raw, text] = match;
      text = text.trim();
      const token = {
        type: 'summary',
        raw: raw,
        text: text.trim(),
        tokens: this.lexer.inlineTokens(text)
      };
      return token;
    }
  },
  renderer(token: any) {
    return `<summary>${this.parser.parseInline(token.tokens)}</summary>`;
  }
};

const timer: any = {
  name: 'timer',
  level: 'block',
  start(src: string) {
    return src.match(/^<timer>/)?.index;
  },
  tokenizer(src: string, tokens: any[]): any {
    const rule = /^<timer\stime=\"([0-9\:]+)\">(((?!<timer)(?:.|\n))+)<\/timer>/;
    const match = rule.exec(src);
    if (match) {
      const [raw, time] = match;
      const token = {
        type: 'timer',
        raw,
        time
      };
      return token;
    }
  },
  renderer(token: any) {
    return `<p>Render is unavailable</p>`;
  }
};
// @ts-ignore-end
marked.use({extensions: [summary, details, timer]});

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
