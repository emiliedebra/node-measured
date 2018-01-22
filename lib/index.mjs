/*  */

import { Collection } from './Collection';

export { metrics } from './metrics';
export { util } from './util';

// for (const name of Object.keys(metrics)) {
//   exports[name] = metrics[name];
// }

// for (const name of Object.keys(util)) {
//   exports[name] = util[name];
// }

export function createCollection(name) {
  return new Collection(name);
}

export { Collection };
