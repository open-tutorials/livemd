import { marked } from 'marked';

export type Heading = marked.Tokens.Heading & { line: number };
