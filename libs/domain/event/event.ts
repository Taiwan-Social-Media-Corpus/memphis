export interface DomainEvent {
  readonly occurredAt: Date;
  readonly name: string;
  readonly version: number;
}
