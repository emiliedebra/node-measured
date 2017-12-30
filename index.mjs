/* @flow */

import { Collection } from './lib/Collection';

export { metrics } from './lib/metrics';
export { util } from './lib/util';

// for (const name of Object.keys(metrics)) {
//   exports[name] = metrics[name];
// }

// for (const name of Object.keys(util)) {
//   exports[name] = util[name];
// }

export function createCollection(name: string): Collection {
  return new Collection(name);
}

export { Collection };
