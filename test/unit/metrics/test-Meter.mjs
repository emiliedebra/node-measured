/* global describe, it, beforeEach, afterEach */
import { describe, it, beforeEach } from 'mocha';
import { Meter } from '../../../lib/metrics/Meter';
// import * as units from '../../../lib/util/units';
// let common = require('../../common');
const assert = require('assert');
const sinon = require('sinon');
// let units  = common.measured.units;

describe('Meter', () => {
  let meter;
  let clock;
  beforeEach(() => {
    clock = sinon.useFakeTimers();
    meter = new Meter({ getTime: () => new Date().getTime() });
  });

  afterEach(() => {
    clock.restore();
  });

  it('all values are correctly initialized', () => {
    assert.deepEqual(meter.toJSON(), {
      type: 'METER',
      mean: 0,
      count: 0,
      currentRate: 0,
      rate1Min: 0,
      rate5Min: 0,
      rate15Min: 0,
    });
  });

  it('supports rates override from opts', () => {
    const rate = sinon.stub().returns(666);
    const properties = {
      m1Rate: { rate },
      m5Rate: { rate },
      m15Rate: { rate },
    };
    const json = new Meter(properties).toJSON();

    assert.equal(json.rate1Min.toFixed(0), '666');
    assert.equal(json.rate5Min.toFixed(0), '666');
    assert.equal(json.rate15Min.toFixed(0), '666');
  });

  it('decay over two marks and ticks', () => {
    meter.mark(5);
    meter._tick();

    let json = meter.toJSON();
    assert.equal(json.count, 5);
    assert.equal(json.rate1Min.toFixed(4), '0.0800');
    assert.equal(json.rate5Min.toFixed(4), '0.0165');
    assert.equal(json.rate15Min.toFixed(4), '0.0055');

    meter.mark(10);
    meter._tick();

    json = meter.toJSON();
    assert.equal(json.count, 15);
    assert.equal(json.rate1Min.toFixed(3), '0.233');
    assert.equal(json.rate5Min.toFixed(3), '0.049');
    assert.equal(json.rate15Min.toFixed(3), '0.017');
  });

  it('mean rate', () => {
    meter.mark(5);
    clock.tick(5000);

    let json = meter.toJSON();
    assert.equal(json.mean, 1);

    clock.tick(5000);

    json = meter.toJSON();
    assert.equal(json.mean, 0.5);
  });

  it('currentRate is the observed rate since the last toJSON call',
    () => {
      meter.mark(1);
      meter.mark(2);
      meter.mark(3);

      clock.tick(3000);

      assert.equal(meter.toJSON().currentRate, 2);
    });

  it('currentRate resets by reading it', () => {
    meter.mark(1);
    meter.mark(2);
    meter.mark(3);

    meter.toJSON();
    assert.strictEqual(meter.toJSON().currentRate, 0);
  });

  it('currentRate also resets internal duration timer by reading it',
    () => {
      meter.mark(1);
      meter.mark(2);
      meter.mark(3);
      clock.tick(1000);
      meter.toJSON();

      clock.tick(1000);
      meter.toJSON();

      meter.mark(1);
      clock.tick(1000);
      assert.strictEqual(meter.toJSON().currentRate, 1);
    });

  it('#reset resets all values', () => {
    meter.mark(1);
    let json = meter.toJSON();

    let value;
    for (const key of Object.keys(json)) {
      value = json[key];
      if (key !== 'type') {
        assert.ok(typeof value === 'number');
      }
    }

    meter.reset();
    json = meter.toJSON();

    for (const key of Object.keys(json)) {
      value = json[key];
      if (key !== 'type') {
        assert.ok(value === 0 || value === null);
      }
    }
  });
});
