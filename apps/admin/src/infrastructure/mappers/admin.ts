import { AdminAggregate } from '../../domain/models/aggregate-root/admin';
import { Admin } from '@memphis/postgres/models/entities';
import { AdminEmailVO, AdminRoleVO, AdminPasswordVO } from '../../domain/models/value-object';

class AdminMapper {
  public static toDomain(admin: Admin) {
    return AdminAggregate.create(admin.id, {
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: AdminEmailVO.create({ value: admin.email }),
      password: AdminPasswordVO.create({ value: admin.password }),
      role: AdminRoleVO.create({ value: 1 }) as AdminRoleVO,
      refreshToken: admin.refreshToken,
      disabled: admin.disabled,
    });
  }

  public static toPersistence(adminEntity: AdminAggregate) {
    const { id, email, firstName, lastName, disabled, password, role, refreshToken } = adminEntity;
    const admin = new Admin({
      id,
      firstName,
      lastName,
      disabled,
      password: password.getValue(),
      roleId: role.getValue(),
      email: email.getValue(),
      refreshToken,
    });
    return admin;
  }

  public static toDto(adminEntity: AdminAggregate) {
    const { id, firstName, lastName, email, role } = adminEntity;
    return {
      id,
      firstName,
      lastName,
      email: email.getValue(),
      role_id: role.getValue(),
    };
  }
}

export default AdminMapper;
