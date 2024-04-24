import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { config } from '@memphis/config';
import { GetCorpusBoardsQuery } from './query';
import { request } from '@memphis/requests';
import { MetaData } from '@memphis/corpus/application/types/corpus';
import { InternalServerErrorException } from '@nestjs/common';

@QueryHandler(GetCorpusBoardsQuery)
export class GetCorpusBoardsQueryHandler
  implements IQueryHandler<GetCorpusBoardsQuery>
{
  constructor() {}

  private generateBoards(boards: string[], mediaPattern: RegExp) {
    return boards.reduce((acc: string[], cur) => {
      const match = cur.match(mediaPattern);
      if (match) acc.push(match[0]);
      return acc;
    }, []);
  }

  async execute(query: GetCorpusBoardsQuery) {
    const url = `${config.corpusURL}/fields/board`;
    const [data, error] = await request<any, MetaData>({
      url,
      method: 'GET',
      query: { outputformat: 'json' },
    });

    if (!data || error) {
      throw new InternalServerErrorException('Internal Blacklab Server Error');
    }

    const boards = Object.keys(data.fieldValues);
    const dto = {
      ptt: this.generateBoards(boards, /.*(?=-ptt)/),
      dcard: this.generateBoards(boards, /.*(?=-dcard)/),
    };
    if (query.board) {
      return dto[query.board as keyof typeof dto];
    }
    return dto;
  }
}
