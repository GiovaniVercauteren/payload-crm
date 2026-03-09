import * as migration_20260309_100641 from './20260309_100641';

export const migrations = [
  {
    up: migration_20260309_100641.up,
    down: migration_20260309_100641.down,
    name: '20260309_100641'
  },
];
