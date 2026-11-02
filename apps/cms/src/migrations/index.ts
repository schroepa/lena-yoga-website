import * as migration_20261102_165253_initial from './20261102_165253_initial';

export const migrations = [
  {
    up: migration_20261102_165253_initial.up,
    down: migration_20261102_165253_initial.down,
    name: '20261102_165253_initial',
  },
];
