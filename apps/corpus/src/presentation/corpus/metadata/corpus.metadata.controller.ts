import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  GetCorpusBoardsQuery,
  GetCorpusMediaQuery,
  GetCorpusInfoQuery,
} from '@memphis/corpus/application/use-cases/corpus/queries';

@Controller('corpus')
class CorpusMetadataController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  async getInfo() {
    const data = await this.queryBus.execute(new GetCorpusInfoQuery());
    return { status: 'success', data };
  }

  @Get('media')
  async getMedia() {
    const data = await this.queryBus.execute(new GetCorpusMediaQuery());
    return { status: 'success', data };
  }

  @Get('boards')
  async getBoards(@Query() query: { board?: string }) {
    const data = await this.queryBus.execute(new GetCorpusBoardsQuery(query));
    return { status: 'success', data };
  }
}

export { CorpusMetadataController };
