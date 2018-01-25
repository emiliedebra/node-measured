/* @flow */
declare type CollectionOutput = {
  GAUGE: ?GaugeOutput,
  COUNTER: ?CounterOutput,
  METER: ?MeterOutput,
  HISTOGRAM: ?HistogramOutput,
  TIMER: ?TimerOutput,
}

declare type GaugeOutput = number;

declare type CounterOutput = number;

declare type MeterOutput = {
  mean: number,
  count: number,
  currentRate: number,
  rate1Min: number,
  rate5Min: number,
  rate15Min: number,
}

declare type HistogramOutput = {
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
  meter: MeterOutput,
  histogram: HistogramOutput,
}
