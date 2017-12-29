/* global describe, it, beforeEach, afterEach */

import { describe, it } from 'mocha';
import Gauge from '../../../lib/metrics/Gauge';

// var common = require('../../common');
const assert = require('assert');

describe('Gauge', () => {
  it('reads value from function', () => {
    let i = 0;

    // should work with common.measured.Gauge()
    const gauge = new Gauge(() => i++);

    assert.equal(gauge.toJSON(), 0);
    assert.equal(gauge.toJSON(), 1);
  });
});
