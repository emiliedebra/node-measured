/* @flow */
declare type GaugeOutput = {
  type: 'GAUGE',
  value: number,
}

declare type CounterOutput = {
  type: 'COUNTER',
  value: number,
};

declare type MeterOutput = {
  type: 'METER',
  mean: number,
  count: number,
  currentRate: number,
  rate1Min: number,
  rate5Min: number,
  rate15Min: number,
}

declare type HistogramOutput = {
  type: 'HISTOGRAM',
  min: ?number,
  max: ?number,
  sum: number,
  variance: ?number,
  mean: number,
  stddev: ?number,
  count: number,
  median: ?number,
  p75: ?number,
  p95: ?number,
  p99: ?number,
  p999: ?number,
}

declare type TimerOutput = {
  type: 'TIMER',
  meter: MeterOutput,
  histogram: HistogramOutput,
}
