import { ValueObject } from '../../interfaces/value-object';

export interface EmailVOProps {
  value: string;
}

export class EmailVO extends ValueObject<EmailVOProps> {
  constructor(props: EmailVOProps) {
    super(props);
  }

  get value() {
    return this.props.value;
  }

  getValue() {
    return this.props.value;
  }

  public static create(props: EmailVOProps) {
    const emailParts = props.value.trim().split('@');
    if (emailParts.length !== 2) {
      return new EmailVO({ value: props.value });
    }
    const [username, domain] = emailParts;
    return new EmailVO({ value: `${username}@${domain.toLowerCase()}` });
  }
}
