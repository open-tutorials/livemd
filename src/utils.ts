import { marked } from 'marked';
import { environment } from 'src/environments/environment';

export function getMarkedOptions(baseUrl: string, imagesUrl: string) {
  const renderer = new marked.Renderer();
  renderer.link = function (href: string, title: string, text: string) {
    const link = marked.Renderer.prototype.link.call(this, href, title, text);
    return link.replace('<a', '<a target=\'_blank\' ');
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
    return html.replace(/src\=\"(.+)\"/, `src="${imagesUrl}/$1"`);
  };

  return {baseUrl: baseUrl + '/', renderer};
}

export function getEndpoint(...chunks: (string | number)[]) {
  return [environment.backend, ...chunks].join('/');
}
