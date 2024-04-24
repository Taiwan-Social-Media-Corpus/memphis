export class GetCorpusBoardsQuery {
  readonly board?: string;

  constructor(props: { board?: string }) {
    this.board = props.board;
  }
}
