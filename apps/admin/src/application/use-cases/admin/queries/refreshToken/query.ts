export class CheckAdminRefreshTokenQuery {
  readonly id: string;
  readonly refreshToken: string;

  constructor(props: { id: string; refreshToken: string }) {
    this.id = props.id;
    this.refreshToken = props.refreshToken;
  }
}
