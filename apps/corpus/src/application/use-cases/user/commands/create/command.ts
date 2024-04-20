export class CreateUserCommand {
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly picture: string;

  constructor(props: {
    email: string;
    firstName: string;
    lastName: string;
    picture: string;
  }) {
    this.email = props.email;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.picture = props.picture;
  }
}
