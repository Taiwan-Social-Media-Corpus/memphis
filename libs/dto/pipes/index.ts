import {
  PipeTransform,
  ArgumentMetadata,
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import { ZodSchema, ZodError } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  /* eslint-disable @typescript-eslint/no-unused-vars */
  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      if (error instanceof ZodError) {
        const { issues } = error;
        if (issues.length) {
          const { message } = issues[0];
          throw new BadRequestException(message);
        }
      }
      throw new UnprocessableEntityException();
    }
  }
}
