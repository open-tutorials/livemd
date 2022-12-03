export const AVATARS: { [key: string]: string } = {
  'santa': '🎅',
  'vampire': '🧛',
  'clown': '🤡',
  'ghost': '👻',
  'alien': '👽',
  'robot': '🤖',
  'cook': '🧑‍🍳',
  'singer': '🧑‍🎤',
  'prince': '🤴',
  'zombie': '🧟',
  'mage': '🧙',
  'fox': '🦊',
  'cat': '🐱',
  'tiger': '🐯',
  'cow': '🐮',
  'panda': '🐼'
};

export const NAMES = [
  'Ленивец',
  'Выхухоль',
  'Тушканчик',
  'Фенек',
  'Ехидна',
  'Лиса',
  'Утконос',
  'Тигр',
  'Потатуйка',
  'Ленивая панда'
];

export const MARKS: { [key: string]: string } = {
  'problem': '🔥',
  'shit': '💩',
  'like': '👍'
};

export const MARKDOWN = `Hello! This is a live markdown!
# +How it works?

Just copy your markdown and create a online channel for your friends!

Berlin, the <md-placeholder value="capital"></md-placeholder> city of Germany.

It is renowned for its exceptional range of <md-placeholder value="landmarks"></md-placeholder>, vibrant cultural scene and way of <md-placeholder value="life"></md-placeholder> that's somehow all go yet relaxed.

\`\`\`html placeholders
<body>
    <!-- form -->
    <<!--?|form|?-->>
        <!-- primary -->
        <input class="?|primary|?">
    </form>
</body>
\`\`\`

\`\`\`js placeholders
describe('Sign up', () => {

    const rnd = /*?|Math.random|?*/();

    it.only('should do register user', () => {

        // open https://demo.realworld.io/
        cy.visit('https://demo.realworld.io/');

        // click Sign Up link in app header
        cy.get('?|.navbar a[href$="/register"]|?').click();

    });
});
\`\`\`

</md-make-code>

***

# +What can you do?

> Sure, you can use common markdown markup.

What to do today:
* play guitar
* go to party
* meet with friends

> We support emoji 🙀 lists.

Do you like?
* ❓ books
* 💀 music

Tasks
* [x] books
* [ ] music

<details>
    <summary>Do you really want to see it?</summary>

This content is hidden!
</details>
`;
