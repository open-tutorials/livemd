import { trim, trimStart } from 'lodash';
import { marked } from 'marked';
import { environment } from 'src/environments/environment';
import { badge, block, details, hr, person, section, summary, tag } from 'src/marked';

export function getMarkedOptions(baseUrl: string, assetsUrl: string) {
  const renderer = new marked.Renderer();
  renderer.link = function (href: string, title: string, text: string) {

    if (href.startsWith('@')) {
      const link = document.createElement('md-link');
      link.setAttribute('href', trimStart(href, '@'));
      link.innerHTML = text;
      return link.outerHTML;
    }

    const normalHref = (() => {
      if (/^http/.test(href)) {
        return href;
      }
      return href.startsWith('/') ? baseUrl + href : baseUrl + '/' + href;
    })();

    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', normalHref);
    if (!!title) {
      link.setAttribute('title', title);
    }
    link.innerHTML = text;
    return link.outerHTML;
  };

  renderer.code = function (code: string, language: string | undefined, isEscaped: boolean) {
    if (!language) {
      throw new Error('Language is not defined');
    }
    {
      const rule = /([\w]+)\splaceholders(?:\s([\w\_\-]+))*$/;
      const match = rule.exec(language);
      if (!!match) {
        const [, language, context] = match;
        const el = document.createElement('md-make-code');
        el.setAttribute('code', code);
        el.setAttribute('language', language);
        el.setAttribute('context', context);
        return el.outerHTML;
      }
    }
    {
      const rule = /json\show\-to$/;
      const match = rule.exec(language);
      if (!!match) {
        const [, id] = match;
        const el = document.createElement('md-how-to');
        el.setAttribute('config', code);
        el.setAttribute('assets-url', assetsUrl);
        return el.outerHTML;
      }
    }
    {
      const rule = /text\scircle\s([\w\_\-]+)$/;
      const match = rule.exec(language);
      if (!!match) {
        const [, id] = match;
        const el = document.createElement('md-circle');
        el.setAttribute('config', code);
        el.setAttribute('id', id);
        el.setAttribute('assets-url', assetsUrl);
        return el.outerHTML;
      }
    }
    {
      const rule = /html\stemplate/;
      const match = rule.exec(language);
      if (!!match) {
        const el = document.createElement('md-template');
        el.setAttribute('html', code);
        el.setAttribute('assets-url', assetsUrl);
        return el.outerHTML;
      }
    }
    {
      const rule = /json\smessage\s([\w\_\-]+)$/;
      const match = rule.exec(language);
      if (!!match) {
        const [, id] = match;
        const el = document.createElement('md-message');
        el.setAttribute('config', code);
        el.setAttribute('id', id);
        return el.outerHTML;
      }
    }
    {
      const rule = /json\srobot\s([\w\_\-]+)$/;
      const match = rule.exec(language);
      if (!!match) {
        const [, id] = match;
        const el = document.createElement('md-robot');
        el.setAttribute('config', code);
        el.setAttribute('id', id);
        return el.outerHTML;
      }
    }
    {
      const rule = /markdown\squiz\s([\w\_\-]+)(?:\s([\w\_\-]+))*$/;
      const match = rule.exec(language);
      if (!!match) {
        const [, id, orientation] = match;
        const el = document.createElement('md-quiz');
        el.setAttribute('config', code);
        el.setAttribute('id', id);
        if (!!orientation) {
          el.setAttribute('orientation', orientation);
        }
        return el.outerHTML;
      }
    }
    {
      const rule = /markdown\spoll\s([\w\_\-]+)(?:\s([\w\_\-]+))*$/;
      const match = rule.exec(language);
      if (!!match) {
        const [, id, orientation] = match;
        const el = document.createElement('md-poll');
        el.setAttribute('config', code);
        el.setAttribute('id', id);
        if (!!orientation) {
          el.setAttribute('orientation', orientation);
        }
        return el.outerHTML;
      }
    }
    {
      const rule = /mermaid(?:\s(.+))*$/;
      const match = rule.exec(language);
      if (!!match) {
        const [, path] = match;
        const el = document.createElement('md-mermaid');
        el.setAttribute('code', code);
        el.setAttribute('assets-url', assetsUrl);
        if (!!path) {
          el.setAttribute('path', path);
        }
        return el.outerHTML;
      }
    }

    // default behaviour
    return marked.Renderer.prototype.code.call(this, code, language, isEscaped);
  };

  renderer.checkbox = function () {
    return '<!-- checkbox -->';
  };

  renderer.listitem = function (text: string, task: boolean, checked) {
    const li = document.createElement('li');
    li.innerHTML = text;
    if (task) {
      li.classList.add('task');
      if (checked) {
        li.classList.add('done');
      }
      li.setAttribute('text', text);
    } else if (/^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/.test(text)) {
      li.setAttribute('class', 'emoji');
    }
    return li.outerHTML;
  };

  renderer.heading = function (text, level, raw, slugger) {
    return marked.Renderer.prototype.heading.call(this, trim(text, '+'), level, raw, slugger);
  };

  renderer.html = function (html: string) {
    return html.replace(/src\=\"((?!http).+)\"/, `src="${assetsUrl}/$1"`);
  };

  marked.use({
    extensions: [badge, summary, details, person(assetsUrl), hr, block, section, tag]
  });

  return {
    baseUrl,
    renderer
  };
}

export function getEndpoint(...chunks: (string | number)[]) {
  return [environment.backend, ...chunks].join('/');
}

declare var ym: any;

export function sendGoal(name: string, params: { [key: string]: string | number } = {}) {
  ym(92037237, 'reachGoal', name, params);
}

export function sendHit(url: string) {
  ym(92037237, 'hit', url);
}

