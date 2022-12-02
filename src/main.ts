import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import hljs from 'highlight.js';
import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import diff from 'highlight.js/lib/languages/diff';
import { marked } from 'marked';
import mermaid from 'mermaid';
import { block, details, hr, person, poll, summary, badge } from 'src/marked';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('css', css);
hljs.registerLanguage('diff', diff);

mermaid.initialize({
  startOnLoad: true,
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
    curve: 'cardinal'
  },
  securityLevel: 'loose'
});

marked.setOptions({
  highlight: function (code, lang) {
    return hljs.highlight(lang, code).value;
  }
});
marked.use({
  extensions: [summary, details, person, poll, hr, block, badge]
});

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
