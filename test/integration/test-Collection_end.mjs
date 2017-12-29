
/* @flow */
import { common } from '../common';

const collection = new common.measured.Collection();

// collection.timer('a').start();
// collection.meter('b').start();
collection.counter('c');

collection.end();
