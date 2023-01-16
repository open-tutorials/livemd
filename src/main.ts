import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import hljs from 'highlight.js';
import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import diff from 'highlight.js/lib/languages/diff';
import python from 'highlight.js/lib/languages/diff';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import { marked } from 'marked';
import mermaid from 'mermaid';
import { badge, block, details, hr, person, section, summary } from 'src/marked';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

mermaid.initialize({
  startOnLoad: false,
  securityLevel: 'loose'
});

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('css', css);
hljs.registerLanguage('python', python);
hljs.registerLanguage('diff', diff);

mermaid.initialize({
  startOnLoad: true,
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
    curve: 'cardinal'
  },
  securityLevel: 'loose',
  theme: 'null',
  fontFamily: '\'Roboto Condensed\', \'Noto Color Emoji\', sans-serif'
});

marked.setOptions({
  highlight: function (code, lang) {
    return hljs.highlight(lang, code).value;
  }
});
marked.use({
  extensions: [badge, summary, details, person, hr, block, section]
});

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
