// @ts-ignore-start

export const details: any = {
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
        raw,
        text: text.trim(),
        tokens: this.lexer.blockTokens(text)
      };
      return token;
    }
  },
  renderer(token: any) {
    const element = document.createElement('details');
    element.innerHTML = this.parser.parse(token.tokens);
    return element.outerHTML;
  }
};

export const summary: any = {
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
        raw,
        text: text.trim(),
        tokens: this.lexer.inlineTokens(text)
      };
      return token;
    }
  },
  renderer(token: any) {
    const element = document.createElement('summary');
    element.innerHTML = this.parser.parseInline(token.tokens);
    return element.outerHTML;
  }
};

export const person = (assetsUrl: string) => ({
  name: 'person',
  level: 'inline',
  start(src: string) {
    return src.match(/@\[/)?.index;
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
    const avatar = document.createElement('img');
    avatar.setAttribute('src', assetsUrl + '/' + token.avatar);

    const element = document.createElement('a');
    element.setAttribute('class', 'person');
    element.setAttribute('target', '_blank');
    element.setAttribute('href', token.link);
    element.innerHTML = `${avatar.outerHTML} ${token.name} 🤙`;
    return element.outerHTML;
  }
});

export const hr: any = {
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

export const block: any = {
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
        raw,
        text: text.trim(),
        tokens: this.lexer.blockTokens(text)
      };
      return token;
    }
  },
  renderer(token: any) {
    const element = document.createElement('block');
    element.innerHTML = this.parser.parse(token.tokens);
    return element.outerHTML;
  }
};

export const badge: any = {
  name: 'badge',
  level: 'inline',
  start(src: string) {
    return src.match(/\~\"/)?.index;
  },
  tokenizer(src: string, tokens: any[]): any {
    const rule = /^~\"(.+)\"/;
    const match = rule.exec(src);
    if (match) {
      let [raw, text] = match;
      text = text.trim();
      const token = {
        type: 'badge',
        raw,
        text: text.trim()
      };
      return token;
    }
  },
  renderer(token: any) {
    const element = document.createElement('span');
    element.setAttribute('class', 'badge');
    element.innerHTML = token.text;
    return element.outerHTML;
  }
};

export const section: any = {
  name: 'section',
  level: 'block',
  start(src: string) {
    return src.match(/^<section>/)?.index;
  },
  tokenizer(src: string, tokens: any[]): any {
    const rule = /^<section\sid\=\"([a-z]+)\">(((?!<section.*>)(?:.|\n))+)<\/section>/;
    const match = rule.exec(src);
    if (match) {
      let [raw, id, text] = match;
      text = text.trim();
      const token = {
        type: 'section',
        id,
        raw,
        text: text.trim(),
        tokens: this.lexer.blockTokens(text)
      };
      return token;
    }
  },
  renderer(token: any) {
    const element = document.createElement('div');
    element.setAttribute('id', token.id);
    element.innerHTML = this.parser.parse(token.tokens);
    return element.outerHTML;
  }
};

// @ts-ignore-end
