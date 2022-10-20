import { marked } from 'marked';
import { environment } from 'src/environments/environment';

export function getMarkedOptions(baseUrl: string, imagesUrl: string) {
  const renderer = new marked.Renderer();
  renderer.link = function (href: string, title: string, text: string) {
    return marked.Renderer.prototype.link.call(this, href, title, text)
      .replace('<a', '<a target=\'_blank\' ');
  };

  renderer.code = function (code: string, language: string | undefined, isEscaped: boolean) {
    if (language == 'mermaid') {
      const el = document.createElement('md-mermaid');
      el.setAttribute('code', code);
      return el.outerHTML;
    }
    // default behaviour
    return marked.Renderer.prototype.code.call(this, code, language, isEscaped);
  };

  renderer.listitem = function (text: string, task: boolean, checked) {
    let item = marked.Renderer.prototype.listitem.call(this, text, task, checked);

    if (task) {
      item = item
        .replace('<input disabled="" type="checkbox"> ', '')
        .replace('<input checked="" disabled="" type="checkbox"> ', '')
        .replace('<li>', '<li class="task' + (checked ? ' checked' : '') + '">');
    } else if (/^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/.test(text)) {
      item = item.replace('<li>', '<li class="emoji">');
    }
    return item;
  };

  renderer.html = function (html: string) {
    return html.replace(/src\=\"((?!http).+)\"/, `src="${imagesUrl}/$1"`);
  };

  return {baseUrl: baseUrl + '/', renderer};
}

export function getEndpoint(...chunks: (string | number)[]) {
  return [environment.backend, ...chunks].join('/');
}

export function prepareHtmlContent(html: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const error = doc.querySelector('parsererror');
  if (!!error) {
    console.error('parse html error', error);
    return html;
  }

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
