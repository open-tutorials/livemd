import { Injectable } from '@angular/core';
import { random } from 'lodash';
import { deserialize, Field, serialize } from 'serialize-ts';
import { generate } from 'shortid';
import { AVATARS } from 'src/consts';

const ME_KEY = 'me';

export class Me {

  @Field()
  id!: string;

  @Field()
  name!: string;

  @Field()
  avatar!: string;

  constructor(defs: Partial<Me> = {}) {
    Object.assign(this, defs);
  }

}

@Injectable({providedIn: 'root'})
export class MeManager {

  me!: Me;

  constructor() {
    const raw = localStorage.getItem(ME_KEY);
    if (!!raw) {
      try {
        this.me = deserialize(JSON.parse(raw), Me);
      } catch (e) {
        console.error(e);
        this.create();
      }
    } else {
      this.create();
    }
  }

  save() {
    const raw = JSON.stringify(serialize(this.me));
    localStorage.setItem(ME_KEY, raw);
  }

  create() {
    const lottery = [
      {
        name: 'Бедный санта',
        avatar: 'santa'
      },
      {
        name: 'Голодный вампир',
        avatar: 'vampire'
      },
      {
        name: 'Кривляка',
        avatar: 'clown'
      },
      {
        name: 'Приведение',
        avatar: 'ghost'
      },
      {
        name: 'Чужой 3',
        avatar: 'alien'
      },
      {
        name: 'Сломанный робот',
        avatar: 'robot'
      },
      {
        name: 'Голодный повар',
        avatar: 'cook'
      },
      {
        name: 'Певец из 80х',
        avatar: 'singer'
      },
      {
        name: 'Ночной принц',
        avatar: 'prince'
      },
      {
        name: 'Поехавший зомби',
        avatar: 'zombie'
      },
      {
        name: 'Гарри Поттер',
        avatar: 'mage'
      },
      {
        name: 'Сумасшедшая лиса',
        avatar: 'fox'
      },
      {
        name: 'Бродячий кот',
        avatar: 'cat'
      },
      {
        name: 'Тигер',
        avatar: 'tiger'
      },
      {
        name: 'Муyy',
        avatar: 'cow'
      },
      {
        name: 'Прикольная панда',
        avatar: 'panda'
      }
    ];

    this.me = new Me({id: generate()});
    Object.assign(this.me, lottery[random(0, lottery.length - 1)]);
    this.save();
  }

}
