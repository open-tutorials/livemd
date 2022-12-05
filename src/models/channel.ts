import { Field } from 'serialize-ts';
import { Member } from 'src/models/member';

export class Channel {
  id!: string;
  members!: { [key: string]: Member };
  marks!: { [key: string]: { [key: number]: string | null } };
  polls!: { [key: string]: { [key: number]: number } };
  comments!: { [key: number]: { [key: string]: string } };
  opened!: { [key: string]: number };
  progress!: { [key: string]: number };
}
