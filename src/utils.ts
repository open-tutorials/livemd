import { trim } from 'lodash';
import { marked } from 'marked';
import { environment } from 'src/environments/environment';

export function getMarkedOptions(baseUrl: string, assetsUrl: string) {
  const renderer = new marked.Renderer();
  renderer.link = function (href: string, title: string, text: string) {
    const normalHref = (() => {
      if (/^http/.test(href)) {
        return href;
      }
      return href.startsWith('/') ? baseUrl + href : baseUrl + '/' + href;
    })();

    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', normalHref);
    link.setAttribute('title', title);
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
      const rule = /json\scircle\s([\w\_\-]+)$/;
      const match = rule.exec(language);
      if (!!match) {
        const [, id] = match;
        const el = document.createElement('md-circle');
        el.setAttribute('config', code);
        el.setAttribute('id', id);
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

    if (language == 'mermaid') {
      const el = document.createElement('md-mermaid');
      el.setAttribute('code', code);
      return el.outerHTML;
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

  return {baseUrl, renderer};
}

export function getEndpoint(...chunks: (string | number)[]) {
  return [environment.backend, ...chunks].join('/');
}

export function prepareHtmlContent(html: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString('<!DOCTYPE html>' + html, 'text/html');

  const error = doc.querySelector('parsererror');
  if (!!error) {
    console.error('parse html error', error);
    return html;
  }

  console.log(html);
  console.log(doc.body);

  parseElement(doc.body);
  return doc.body.innerHTML;
}

function parseElement(element: Element) {
  for (let i = 0; i < element.children.length; i++) {
    const children = element.children[i];
    parseElement(children);
  }
  insertContent(element);
}

function insertContent(element: Element) {
  if (element.tagName.startsWith('MD-')) {
    element.setAttribute('html', element.innerHTML);
  }
}
