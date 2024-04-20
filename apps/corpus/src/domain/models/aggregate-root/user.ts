import { UpdateUserRefreshTokenEvent } from '@memphis/corpus/domain/events';
import { Result } from '@memphis/result';
import { AggregateRoot } from '@memphis/domain/model/interfaces/aggregate-root';
import { UserEmailVO } from '../value-object';

export interface UserAggregateProps {
  firstName: string;
  lastName: string;
  picture: string;
  email: UserEmailVO;
  refreshToken: string;
  disabled: boolean;
}

export class UserAggregate extends AggregateRoot<string, UserAggregateProps> {
  constructor(id: string, props: UserAggregateProps) {
    super(id, props);
  }

  get firstName() {
    return this.props.firstName;
  }

  get lastName() {
    return this.props.lastName;
  }

  get picture() {
    return this.props.picture;
  }

  get email() {
    return this.props.email;
  }

  get disabled() {
    return this.props.disabled;
  }

  get refreshToken() {
    return this.props.refreshToken;
  }

  setFirstName(firstName: string) {
    this.props.firstName = firstName;
    return Result.Ok(null);
  }

  setLastName(lastName: string) {
    this.props.lastName = lastName;
    return Result.Ok(null);
  }

  setEmail(emailVO: UserEmailVO) {
    if (this.email.equals(emailVO)) {
      return Result.Err('Identical email address');
    }
    this.props.email = emailVO;
    return Result.Ok(null);
  }

  setRefreshToken(refreshToken: string) {
    if (this.refreshToken !== refreshToken) {
      this.props.refreshToken = refreshToken;
    }
    return Result.Ok(null);
  }

  setDisabled(disabled: boolean) {
    this.props.disabled = disabled;
    return Result.Ok(null);
  }

  registerRefreshTokenUpdateEvent() {
    const event = new UpdateUserRefreshTokenEvent({
      id: this.id,
      refreshToken: this.refreshToken,
    });
    this.apply(event);
  }

  public equals(obj?: UserAggregate | undefined) {
    if (obj == null || obj === undefined) {
      return false;
    }
    return this.id === obj.id;
  }

  static create(id: string, props: UserAggregateProps) {
    return new UserAggregate(id, props);
  }
}
