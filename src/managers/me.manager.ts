import { Injectable } from '@angular/core';
import { deserialize, Field, serialize } from 'serialize-ts';
import { generate } from 'shortid';

const ME_KEY = 'me';

export class Me {

  @Field()
  id!: string;

  @Field()
  name!: string;

  @Field()
  avatar!: string;

  @Field()
  confirmed!: boolean;

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
    this.me = new Me({
      id: generate(),
      name: 'Виталик',
      avatar: 'santa',
      confirmed: false
    });
    this.save();
  }

}
