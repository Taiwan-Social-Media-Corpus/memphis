import { PrimaryColumn, Column, ColumnOptions, ColumnType } from 'typeorm';
import { config } from '@memphis/config';

type CUIDColumnOptions = Pick<
  ColumnOptions,
  'nullable' | 'primary' | 'comment' | 'default'
>;

function adaptType(type: ColumnType) {
  if (config.nodeEnv !== 'production') {
    return type;
  }

  switch (type) {
    case 'timestamp':
      return 'text';
    case 'char':
      return 'text';
    case 'json':
      return 'text';
    default:
      return type;
  }
}

const CUIDColumn = (options?: CUIDColumnOptions) => {
  const { primary = false, nullable = false, comment } = options || {};

  return primary
    ? PrimaryColumn({
        type: adaptType('char'),
        length: 25,
        comment,
      })
    : Column({
        nullable,
        type: adaptType('char'),
        length: 25,
        comment,
      });
};

export default CUIDColumn;
