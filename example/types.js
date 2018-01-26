/* @flow */
declare module 'node-measured-es' {
  declare export type TMetricOutput =
  { 'GAUGE': TGaugeOutput } |
  { 'METER': TMeterOutput } |
  { 'COUNTER': TCounterOutput } |
  { 'TIMER': TTimerOutput } |
  { 'HISTOGRAM': THistogramOutput };
  declare export type TCollectionOutput = {
    [key: string]: TMetricOutput;
  }
  declare export type TGaugeOutput = number;
  declare export type TCounterOutput = number;
  declare export type TMeterOutput = {
    mean: number,
    count: number,
    currentRate: number,
    rate1Min: number,
    rate5Min: number,
    rate15Min: number,
  }
  declare export type THistogramOutput = {
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
  declare export type TTimerOutput = {
    meter: TMeterOutput,
    histogram: THistogramOutput,
  }
  declare export class Counter {
    -_count: number;
    constructor(properties: Object): void;
    inc(n: number): void;
    dec(n: number): void;
    reset(count: number): void;
    toJSON(): TCounterOutput;
  }
  declare export class Gauge {
    -_readFn: Function;
    constructor(readFn: Function): void;
    toJSON(): TGaugeOutput;
  }
  declare export class Histogram {
    constructor(properties: Object): void;
    init(properties: Object): void;
    toJSON(): THistogramOutput;
    update(value: number): void;
    reset(): void;
    percentiles(percentiles: Array<number>): Object;
    hasValues(): boolean;
  }
  declare export class Meter {
    constructor(properties: Object): void;
    init(properties: Object): void;
    toJSON(): TMeterOutput;
    reset(): void;
    mark(n: number): void;
    end(): void;
    ref(): void;
    unref(): void;
  }
  declare export class Timer {
    constructor(properties: Object): void;
    start(): any; // is actually a StopWatch
    update(value: number): void;
    reset(): void;
    end(): void;
    ref(): void;
    unref(): void;
    toJSON(): TTimerOutput;
  }
  declare export class Collection {
    constructor(name: string): void;
    toJSON(name: ?string): TCollectionOutput;
    end(): void;
    meter(name: string, properties: Object): Meter;
    gauge(name: string, properties: Object): Gauge;
    histogram(name: string, properties: Object): Histogram;
    counter(name: string, properties: Object): Counter;
    timer(name: string, properties: Object): Timer;
  }
}
