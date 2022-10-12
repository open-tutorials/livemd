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

const poll: any = {
  name: 'poll',
  level: 'block',
  start(src: string) {
    return src.match(/^\?.+\?\n/)?.index;
  },
  tokenizer(src: string, tokens: any[]): any {
    const rule = /^\?(.+)\?((?:\n(?:\*\s.+)?)+)/;
    const match = rule.exec(src);
    if (match) {
      let [raw, question, options] = match;
      question = question.trim();
      const token = {
        type: 'poll',
        raw: raw,
        question: question.trim(),
        options: options.split(/\*/).map(o => o.trim())
          .filter(o => !!o)
      };
      return token;
    }
  },
  renderer(token: any) {
    throw new Error('Was not implemented');
  }
};

const person: any = {
  name: 'person',
  level: 'inline',
  start(src: string) {
    return src.match(/^@\[/)?.index;
  },
  tokenizer(src: string, tokens: any[]): any {
    const rule = /^@\[([^\|]+)\|([^\|]+)(?:\|(.+))*\]/;
    const match = rule.exec(src);
    if (match) {
      const [raw, name, link, avatar] = match;
      const token = {
        type: 'person',
        raw,
        name,
        link,
        avatar
      };
      return token;
    }
  },
  renderer(token: any) {
    return `<a class="person" target="_blank" href="${token.link}"><img src="${token.avatar}"> ${token.name} 🤙</a>`;
  }
};

const hr: any = {
  name: 'hr',
  level: 'block',
  start(src: string) {
    return src.match(/^\*\*\*\s*\d+\:\d+/)?.index;
  },
  tokenizer(src: string, tokens: any[]): any {
    const rule = /^\*\*\*\s*(\d+\:\d+)\s*\*\*\*/;
    const match = rule.exec(src);
    if (match) {
      const [raw, time] = match;
      const token = {
        type: 'hr',
        raw,
        time
      };
      return token;
    }
  },
  renderer(token: any) {
    throw new Error('Not implemented');
  }
};

const block: any = {
  name: 'block',
  level: 'block',
  start(src: string) {
    return src.match(/^<block>/)?.index;
  },
  tokenizer(src: string, tokens: any[]): any {
    const rule = /^<block>(((?!<block>)(?:.|\n))+)<\/block>/;
    const match = rule.exec(src);
    if (match) {
      let [raw, text] = match;
      text = text.trim();
      const token = {
        type: 'block',
        raw: raw,
        text: text.trim(),
        tokens: this.lexer.blockTokens(text)
      };
      return token;
    }
  },
  renderer(token: any) {
    return `<block>${this.parser.parse(token.tokens)}</block>`;
  }
};

// @ts-ignore-end
marked.use({extensions: [summary, details, person, poll, hr, block]});

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
