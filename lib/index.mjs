/*  */

import { Collection } from './Collection';

export { metrics } from './metrics';
export { util } from './util';

export function createCollection(name) {
  return new Collection(name);
}

export { Collection };