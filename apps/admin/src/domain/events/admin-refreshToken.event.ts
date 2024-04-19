import { DomainEvent } from '@memphis/domain/event';

export class UpdateAdminRefreshTokenEvent implements DomainEvent {
  readonly occurredAt: Date;
  readonly name: string;
  readonly version: number;
  readonly id: string;
  readonly refreshToken: string;

  constructor(props: { id: string; refreshToken: string }) {
    this.name = 'AdminRefreshTokenUpdated';
    this.occurredAt = new Date();
    this.version = 1;
    this.id = props.id;
    this.refreshToken = props.refreshToken;
  }
}
