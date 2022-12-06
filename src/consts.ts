import { environment } from 'src/environments/environment';
import { Tutorial } from 'src/models/tutorial';

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

export const TUTORIALS: { [key: string]: Tutorial } = {
  // for testing
  'example': {
    source: environment.production
      ? 'https://md.epic1h.com/api/example' : 'http://localhost:4300/api/example',
    baseUrl: 'https://github.com/breslavsky/hello-cypress/blob/main',
    assetsUrl: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main'
  },

  // manual testing
  'became_a_tester': {
    source: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main/tutorials/became_a_tester.md',
    baseUrl: 'https://github.com/breslavsky/hello-cypress/blob/main',
    assetsUrl: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main'
  },
  'bug_tracking': {
    source: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main/tutorials/bug_tracking.md',
    baseUrl: 'https://github.com/breslavsky/hello-cypress/blob/main',
    assetsUrl: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main'
  },
  'perfect_bug_reports': {
    source: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main/tutorials/perfect_bug_reports.md',
    baseUrl: 'https://github.com/breslavsky/hello-cypress/blob/main',
    assetsUrl: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main'
  },

  // cypress
  'cypress_test_flight': {
    source: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main/tutorials/cypress_test_flight.md',
    baseUrl: 'https://github.com/breslavsky/hello-cypress/blob/main',
    assetsUrl: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main'
  },
  'best_selectors': {
    source: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main/tutorials/best_selectors.md',
    baseUrl: 'https://github.com/breslavsky/hello-cypress/blob/main',
    assetsUrl: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main'
  },
  'test_mama_project': {
    source: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main/tutorials/test_mama_project.md',
    baseUrl: 'https://github.com/breslavsky/hello-cypress/blob/main',
    assetsUrl: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main'
  },
  'my_first_refactor': {
    source: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main/tutorials/my_first_refactor.md',
    baseUrl: 'https://github.com/breslavsky/hello-cypress/blob/main',
    assetsUrl: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main'
  },
  'fake_data': {
    source: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main/tutorials/fake_data.md',
    baseUrl: 'https://github.com/breslavsky/hello-cypress/blob/main',
    assetsUrl: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main'
  },
  'deep_cypress': {
    source: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main/tutorials/deep_cypress.md',
    baseUrl: 'https://github.com/breslavsky/hello-cypress/blob/main',
    assetsUrl: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main'
  },
  'finish_mama_project': {
    source: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main/tutorials/finish_mama_project.md',
    baseUrl: 'https://github.com/breslavsky/hello-cypress/blob/main',
    assetsUrl: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main'
  },

  // common

  'install_node_js': {
    source: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main/tutorials/install_node_js.md',
    baseUrl: 'https://github.com/breslavsky/hello-cypress/blob/main',
    assetsUrl: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main'
  },

  // challenges

  'save_the_world': {
    source: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main/quest/save_the_world.md',
    baseUrl: 'https://github.com/breslavsky/hello-cypress/blob/main',
    assetsUrl: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main'
  },

  // streams

  'memes_teach': {
    source: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main/streams/memes_teach.md',
    baseUrl: 'https://github.com/breslavsky/hello-cypress/blob/main',
    assetsUrl: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main'
  },

  // experiments
  'startup_onboarding': {
    source: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main/tutorials/startup_onboarding.md',
    baseUrl: 'https://github.com/breslavsky/hello-cypress/blob/main',
    assetsUrl: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main'
  }
};
