import { Collection } from '..';

const coll = new Collection('COLLECTION');
setInterval(() => {
  coll.counter('Measurements').inc();
  coll.meter('Measurements').mark();
  console.log(coll.toJSON());
}, 1000);
