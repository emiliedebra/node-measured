/* global describe, it, beforeEach, afterEach */
import assert from 'assert';
import sinon from 'sinon';
import { describe, it, beforeEach } from 'mocha';
import { Stopwatch } from '../../../lib/util/Stopwatch';
// import * as units from '../../../lib/util/units';

// var common    = require('../../common');
// var assert    = require('assert');
// var Stopwatch = common.measured.Stopwatch;
// var sinon     = require('sinon');

describe('Stopwatch', () => {
  let watch;
  let clock;
  beforeEach(() => {
    clock = sinon.useFakeTimers();
    watch = new Stopwatch({ getTime: () => new Date().getTime() });
  });

  afterEach(() => {
    clock.restore();
  });

  it('returns time on end', () => {
    clock.tick(100);

    const elapsed = watch.end();
    assert.equal(elapsed, 100);
  });

  it('emits time on end', () => {
    clock.tick(20);

    let time;
    watch.on('end', (_time) => {
      time = _time;
    });

    watch.end();

    assert.equal(time, 20);
  });

  it('becomes useless after being ended once', () => {
    clock.tick(20);

    let time;
    watch.on('end', (_time) => {
      time = _time;
    });

    assert.equal(watch.end(), 20);
    assert.equal(time, 20);

    time = null;
    assert.equal(watch.end(), undefined);
    assert.equal(time, null);
  });
});
