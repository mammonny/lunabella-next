import * as migration_20260121_162909 from './20260121_162909';
import * as migration_20260505_201602_exhibitions_awards_optional_dog from './20260505_201602_exhibitions_awards_optional_dog';

export const migrations = [
  {
    up: migration_20260121_162909.up,
    down: migration_20260121_162909.down,
    name: '20260121_162909'
  },
  {
    up: migration_20260505_201602_exhibitions_awards_optional_dog.up,
    down: migration_20260505_201602_exhibitions_awards_optional_dog.down,
    name: '20260505_201602_exhibitions_awards_optional_dog'
  },
];
