import { Member } from 'src/models/member';

export class Channel {
  id!: string;
  members!: { [key: string]: Member };
  polls!: { [key: string]: { [key: number]: number } };
}
