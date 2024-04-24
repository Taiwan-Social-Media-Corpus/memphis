import { InternalServerErrorException } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { config } from '@memphis/config';
import { MetaData } from '@memphis/corpus/application/types/corpus';
import { request } from '@memphis/requests';
import { GetCorpusMediaQuery } from './query';

@QueryHandler(GetCorpusMediaQuery)
export class GetCorpusMediaQueryHandler
  implements IQueryHandler<GetCorpusMediaQuery>
{
  constructor() {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(query: GetCorpusMediaQuery) {
    const [data, error] = await request<any, MetaData>({
      url: `${config.corpusURL}/fields/media`,
      method: 'GET',
      query: { outputformat: 'json' },
    });

    if (!data || error) {
      throw new InternalServerErrorException('Internal Blacklab Server Error');
    }
    return data.fieldValues;
  }
}
