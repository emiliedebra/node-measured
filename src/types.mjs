/* @flow */
export type TMetricCollectionOutput = {
  [key: string]: TMetricOutput;
}
export type TMetricOutput = {
  [key: ?string]: TMetric;
}

export type TMetric = TCounterOutput | TGaugeOutput | TMeterOutput | TTimerOutput | THistogramOutput;
export type TMetricConstant = 'GAUGE' | 'METER' | 'COUNTER' | 'TIMER' | 'HISTOGRAM';

export type TCollectionOutput = {
  [key: ?string]: TMetricCollectionOutput;
}

export type TGaugeOutput = number;

export type TCounterOutput = number;

export type TMeterOutput = {
  mean: number,
  count: number,
  currentRate: number,
  rate1Min: number,
  rate5Min: number,
  rate15Min: number,
}

export type THistogramOutput = {
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

export type TTimerOutput = {
  meter: TMeterOutput,
  histogram: THistogramOutput,
}
