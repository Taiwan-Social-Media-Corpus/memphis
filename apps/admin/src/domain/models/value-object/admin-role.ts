import { ValueObject } from '@memphis/domain/model/interfaces/value-object';
import { Result } from '@memphis/result';
import Definition from '@memphis/definition';

export interface AdminRoleVOProps {
  value: number;
}

export class AdminRoleVO extends ValueObject<AdminRoleVOProps> {
  constructor(props: AdminRoleVOProps) {
    super(props);
  }

  get value() {
    return this.props.value;
  }

  getValue() {
    return this.props.value;
  }

  public static create(props: AdminRoleVOProps) {
    const roles = Object.values(Definition.AdminRole).filter(
      (role) => typeof role === 'number',
    );
    const hasRole = roles.includes(props.value);
    if (!hasRole) {
      return Result.Err('Invalid role');
    }
    return new AdminRoleVO({ value: props.value });
  }
}
