import { ValueObject } from '@memphis/domain/model/interfaces/value-object';

export interface UserEmailVOProps {
  value: string;
}

export class UserEmailVO extends ValueObject<UserEmailVOProps> {
  constructor(props: UserEmailVOProps) {
    super(props);
  }

  get value() {
    return this.props.value;
  }

  getValue() {
    return this.props.value;
  }

  public static create(props: UserEmailVOProps) {
    const emailParts = props.value.trim().split('@');
    if (emailParts.length !== 2) {
      return new UserEmailVO({ value: props.value });
    }
    const [username, domain] = emailParts;
    return new UserEmailVO({ value: `${username}@${domain.toLowerCase()}` });
  }
}
