import { ValueObject } from '../../interfaces/value-object';
import bcrypt from 'bcryptjs';

export interface PasswordVOProps {
  value: string;
}

export class PasswordVO extends ValueObject<PasswordVOProps> {
  constructor(props: PasswordVOProps) {
    super(props);
  }

  get value() {
    return this.props.value;
  }

  getValue() {
    return this.props.value;
  }

  async compare(plainPwd: string) {
    return await bcrypt.compare(plainPwd, this.props.value);
  }

  public static async createHash(props: PasswordVOProps) {
    const hashed = await bcrypt.hash(props.value, 10);
    return new PasswordVO({ value: hashed });
  }

  public static create(props: PasswordVOProps) {
    return new PasswordVO({ value: props.value });
  }
}
