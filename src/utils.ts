import { marked } from 'marked';
import { environment } from 'src/environments/environment';

export function getMarkedOptions(baseUrl: string, imagesUrl: string) {
  const renderer = new marked.Renderer();
  renderer.link = function (href: string, title: string, text: string) {
    const link = marked.Renderer.prototype.link.call(this, href, title, text);
    return link.replace('<a', '<a target=\'_blank\' ');
  };

  renderer.listitem = function (text: string, task: boolean, checked) {
    const listitem = marked.Renderer.prototype.listitem.call(this, text, task, checked);
    console.log(listitem);
    return task
      ? listitem.replace('<li>', '<li class="task">')
      : listitem;
  };

  renderer.html = function (html: string) {
    return html.replace(/src\=\"(.+)\"/, `src="${imagesUrl}/$1"`);
  };

  return {baseUrl: baseUrl + '/', renderer};
}

export function getEndpoint(...chunks: (string | number)[]) {
  return [environment.backend, ...chunks].join('/');
}
