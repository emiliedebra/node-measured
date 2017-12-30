/* global describe, it, beforeEach, afterEach */
import assert from 'assert';
import { describe, it } from 'mocha';
import { ExponentiallyMovingWeightedAverage } from '../../../lib/util/ExponentiallyMovingWeightedAverage';
import * as units from '../../../lib/util/units';

// var common = require('../../common');
// var assert = require('assert');
// var units = common.measured.units;
// var EMWA = common.measured.ExponentiallyMovingWeightedAverage;

describe('ExponentiallyMovingWeightedAverage', () => {
  it('decay over several updates and ticks', () => {
    const ewma = new ExponentiallyMovingWeightedAverage(units.MINUTES, 5 * units.SECONDS);

    ewma.update(5);
    ewma.tick();

    assert.equal(ewma.rate(units.SECONDS).toFixed(3), '0.080');

    ewma.update(5);
    ewma.update(5);
    ewma.tick();

    assert.equal(ewma.rate(units.SECONDS).toFixed(3), '0.233');

    ewma.update(15);
    ewma.tick();

    assert.equal(ewma.rate(units.SECONDS).toFixed(3), '0.455');

    let i;
    for (i = 0; i < 200; i++) {
      ewma.update(15);
      ewma.tick();
    }

    assert.equal(ewma.rate(units.SECONDS).toFixed(3), '3.000');
  });
});
