/* global describe, it, beforeEach, afterEach */
/* @flow */

import { describe, it, beforeEach, afterEach } from 'mocha';
import Timer from '../../../lib/metrics/Timer';
import Meter from '../../../lib/metrics/Meter';
import Histogram from '../../../lib/metrics/Histogram';

// const common = require('../../common');
const assert = require('assert');
const sinon = require('sinon');
// var Timer = common.measured.Timer;
// var Histogram = common.measured.Histogram;
// var Meter = common.measured.Meter;

describe('Timer', () => {
  let timer;
  let meter;
  let histogram;
  let clock;
  beforeEach(() => {
    clock = sinon.useFakeTimers();
    meter = sinon.stub(new Meter());
    histogram = sinon.stub(new Histogram());

    timer = new Timer({
      meter,
      histogram,
      getTime: () => (new Date().getTime()),
    });
  });

  afterEach(() => {
    clock.restore();
  });

  it('can be initialized without options', () => {
    timer = new Timer();
  });

  it('#update() marks the meter', () => {
    timer.update(5);

    assert.ok(meter.mark.calledOnce);
  });

  it('#update() updates the histogram', () => {
    timer.update(5);

    assert.ok(histogram.update.calledWith(5));
  });

  it('#toJSON() contains meter info', () => {
    meter.toJSON.returns({ a: 1, b: 2 });
    const json = timer.toJSON();

    assert.deepEqual(json.meter, { a: 1, b: 2 });
  });

  it('#toJSON() contains histogram info', () => {
    histogram.toJSON.returns({ c: 3, d: 4 });
    const json = timer.toJSON();

    assert.deepEqual(json.histogram, { c: 3, d: 4 });
  });

  it('#start returns a Stopwatch which updates the timer', () => {
    clock.tick(10);

    const watch = timer.start();
    clock.tick(50);
    watch.end();

    assert.ok(meter.mark.calledOnce);
    assert.equal(histogram.update.args[0][0], 50);
  });

  it('#reset is delegated to histogram and meter', () => {
    timer.reset();

    assert.ok(meter.reset.calledOnce);
    assert.ok(histogram.reset.calledOnce);
  });
});
