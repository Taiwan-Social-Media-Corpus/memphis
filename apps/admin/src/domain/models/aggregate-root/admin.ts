import { UnauthorizedException } from '@nestjs/common';
import { UpdateAdminRefreshTokenEvent } from '@memphis/admin/domain/events';
import { AggregateRoot } from '@memphis/domain/model/interfaces/aggregate-root';
import { Result } from '@memphis/result';
import { AdminEmailVO } from '../value-object/admin-email';
import { AdminPasswordVO } from '../value-object/admin-password';
import { AdminRoleVO } from '../value-object/admin-role';

export interface AdminAggregateProps {
  firstName: string;
  lastName: string;
  email: AdminEmailVO;
  password: AdminPasswordVO;
  refreshToken: string;
  role: AdminRoleVO;
  disabled: boolean;
}

export class AdminAggregate extends AggregateRoot<string, AdminAggregateProps> {
  constructor(id: string, props: AdminAggregateProps) {
    super(id, props);
  }

  get firstName() {
    return this.props.firstName;
  }

  get lastName() {
    return this.props.lastName;
  }

  get email() {
    return this.props.email;
  }

  get disabled() {
    return this.props.disabled;
  }

  get password() {
    return this.props.password;
  }

  get role() {
    return this.props.role;
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

  setEmail(emailVO: AdminEmailVO) {
    if (this.email.equals(emailVO)) {
      return Result.Err('Identical email address');
    }
    this.props.email = emailVO;
    return Result.Ok(null);
  }

  setPassword(passwordVO: AdminPasswordVO) {
    this.props.password = passwordVO;
    return Result.Ok(null);
  }

  setRoleId(roleVO: AdminRoleVO) {
    if (!this.role.equals(roleVO)) {
      this.props.role = roleVO;
    }
    return Result.Ok(null);
  }

  setDisabled(disabled: boolean) {
    this.props.disabled = disabled;
    return Result.Ok(null);
  }

  setRefreshToken(refreshToken: string) {
    if (this.refreshToken !== refreshToken) {
      this.props.refreshToken = refreshToken;
    }
    return Result.Ok(null);
  }

  async validatePassword(plainPwd: string) {
    const result = await this.password.compare(plainPwd);
    if (!result) {
      return Result.Err(new UnauthorizedException());
    }
    return Result.Ok(null);
  }

  registerRefreshTokenUpdateEvent() {
    const event = new UpdateAdminRefreshTokenEvent({
      id: this.id,
      refreshToken: this.refreshToken,
    });
    this.apply(event);
  }

  public equals(obj?: AdminAggregate | undefined) {
    if (obj == null || obj === undefined) {
      return false;
    }
    return this.id === obj.id;
  }

  static create(id: string, props: AdminAggregateProps) {
    return new AdminAggregate(id, props);
  }
}
