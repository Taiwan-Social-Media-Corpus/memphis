import { UserAggregate } from '@memphis/corpus/domain/models/aggregate-root/user';
import { UserEmailVO } from '@memphis/corpus/domain/models/value-object';
import { User } from '@memphis/postgres/models/entities';

class UserMapper {
  public static toDomain(user: User) {
    return UserAggregate.create(user.id, {
      firstName: user.firstName,
      lastName: user.lastName,
      email: UserEmailVO.create({ value: user.email }),
      picture: user.picture,
      disabled: user.disabled,
      refreshToken: user.refreshToken,
    });
  }

  public static toPersistence(userEntity: UserAggregate) {
    const { id, firstName, lastName, email, picture, disabled, refreshToken } =
      userEntity;
    const user = new User({
      id,
      firstName,
      lastName,
      picture,
      disabled,
      refreshToken,
      email: email.getValue(),
    });
    return user;
  }

  public static toDto(userEntity: UserAggregate) {
    const { firstName, lastName, email, picture } = userEntity;
    return {
      firstName,
      lastName,
      picture,
      email: email.getValue(),
    };
  }
}

export default UserMapper;
