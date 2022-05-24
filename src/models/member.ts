export class Member {
  id!: string;
  name!: string;
  avatar!: string;

  constructor(props = {}) {
    Object.assign(this, props);

  }

}
