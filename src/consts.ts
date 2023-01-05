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

export const INDEX: { tutorials: { [key: string]: Tutorial } } = {
  tutorials: {
    // for testing
    'example': {
      title: 'Пример туториала',
      source: environment.production
        ? 'https://md.epic1h.com/api/example' : 'http://localhost:4300/api/example',
      baseUrl: 'https://github.com/breslavsky/hello-cypress/blob/main',
      assetsUrl: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main'
    },

    // mentor
    'js_mentor': {
      title: 'Менторство по Java Script',
      source: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main/mentor/java_script.md',
      baseUrl: 'https://github.com/breslavsky/hello-cypress/blob/main',
      assetsUrl: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main'
    },

    // manual testing
    'home': {
      title: 'Серия туториалов по авто-тестированию',
      source: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main/README.md',
      baseUrl: 'https://github.com/breslavsky/hello-cypress/blob/main',
      assetsUrl: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main'
    },

    // manual testing
    'became_a_tester': {
      title: 'Туториал: ломаем приложение онлайн-банка',
      source: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main/tutorials/became_a_tester.md',
      baseUrl: 'https://github.com/breslavsky/hello-cypress/blob/main',
      assetsUrl: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main'
    },
    'bug_tracking': {
      title: 'Туториал: организуем баг-трекинг в стартапе',
      source: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main/tutorials/bug_tracking.md',
      baseUrl: 'https://github.com/breslavsky/hello-cypress/blob/main',
      assetsUrl: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main'
    },
    'perfect_bug_reports': {
      title: 'Туториал: исследуем баги и пишем профессиональные баг-репорты',
      source: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main/tutorials/perfect_bug_reports.md',
      baseUrl: 'https://github.com/breslavsky/hello-cypress/blob/main',
      assetsUrl: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main'
    },

    // cypress

    'cypress_test_flight': {
      title: 'Туториал: первый полет на Cypress',
      source: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main/tutorials/cypress_test_flight.md',
      baseUrl: 'https://github.com/breslavsky/hello-cypress/blob/main',
      assetsUrl: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main'
    },
    'best_selectors': {
      title: 'Туториал: находим лучшие селекторы для UI элементов',
      source: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main/tutorials/best_selectors.md',
      baseUrl: 'https://github.com/breslavsky/hello-cypress/blob/main',
      assetsUrl: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main'
    },
    'test_mama_project': {
      title: 'Туториал: тестируем мама проект на Cypress',
      source: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main/tutorials/test_mama_project.md',
      baseUrl: 'https://github.com/breslavsky/hello-cypress/blob/main',
      assetsUrl: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main'
    },
    'my_first_refactor': {
      title: 'Туториал: мой первый рефактор в Cypress',
      source: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main/tutorials/my_first_refactor.md',
      baseUrl: 'https://github.com/breslavsky/hello-cypress/blob/main',
      assetsUrl: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main'
    },
    'fake_data': {
      title: 'Туториал: фейк дата в тестах',
      source: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main/tutorials/fake_data.md',
      baseUrl: 'https://github.com/breslavsky/hello-cypress/blob/main',
      assetsUrl: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main'
    },
    'deep_cypress': {
      title: 'Туториал: как устроен Cypress внутри',
      source: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main/tutorials/deep_cypress.md',
      baseUrl: 'https://github.com/breslavsky/hello-cypress/blob/main',
      assetsUrl: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main'
    },
    'finish_mama_project': {
      title: 'Туториал: как устроен Cypress внутри',
      source: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main/tutorials/finish_mama_project.md',
      baseUrl: 'https://github.com/breslavsky/hello-cypress/blob/main',
      assetsUrl: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main'
    },
    'test_api': {
      title: 'Тестируем API в Cypress',
      source: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main/tutorials/test_api.md',
      baseUrl: 'https://github.com/breslavsky/hello-cypress/blob/main',
      assetsUrl: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main'
    },

    // common

    'install_node_js': {
      title: 'Установка Node.js',
      source: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main/tutorials/install_node_js.md',
      baseUrl: 'https://github.com/breslavsky/hello-cypress/blob/main',
      assetsUrl: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main'
    },

    // challenges

    'save_the_world': {
      title: 'Квест: спасти мир от хакера Hакатика',
      source: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main/quests/save_the_world.md',
      baseUrl: 'https://github.com/breslavsky/hello-cypress/blob/main',
      assetsUrl: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main'
    },

    // streams

    'memes_teach': {
      title: 'Стрим-практикум: мемы учат',
      source: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main/streams/memes_teach.md',
      baseUrl: 'https://github.com/breslavsky/hello-cypress/blob/main',
      assetsUrl: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main'
    },

    // experiments
    'startup_onboarding': {
      title: 'Онбординг в стартап',
      source: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main/tutorials/startup_onboarding.md',
      baseUrl: 'https://github.com/breslavsky/hello-cypress/blob/main',
      assetsUrl: 'https://raw.githubusercontent.com/breslavsky/hello-cypress/main'
    }
  }

};
