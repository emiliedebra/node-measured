# node-measured-es
This is an expiremental ES6 and Flow metrics module inspired by and adapted from Felixge's `measured` module.
___

## Install

```
npm install node-measured#node-measured-es
```

## Usage

**Step 1:** Add measurements to your code. For example, lets track the
requests/sec of a http server:

```js
const http  = require('http');
import { Collection } from 'node-measured-es';

const stats = new Collection('metrics');

http.createServer(function(req, res) {
  stats.meter('requestsPerSecond').mark();
  res.end('Thanks');
}).listen(3000);
```

**Step 2:** Show the collected measurements (more advanced examples follow later):

```js
setInterval(function() {
  console.log(stats.toJSON());
}, 1000);
```

This will output something like this every second:

```
metrics:
{ requestsPerSecond:
  METER:
   { mean: 1710.2180279856818,
     count: 10511,
     'currentRate': 1941.4893498239829,
     'rate1Min': 168.08263156623656,
     'rate5Min': 34.74630977619571,
     'rate15Min': 11.646507524106095 } }
```

**Step 3:** Aggregate the data into your backend of choice. Felixge recommend's
[graphite][].

[graphite]: http://graphite.wikidot.com/

## Metrics

The following metrics are available (both standalone and on the Collection API):

### Gauge

Values that can be read instantly. Example:

```js
import { metrics } from 'node-measured-es';
var gauge = new metrics.Gauge(() => {
  return process.memoryUsage().rss;
});
```

There is currently no callback support for Gauges because otherwise it would be
very difficult to report the metrics inside a collection within a regular
interval.

**Options:**

* Gauges take a function as parameter which needs to return their current value.

**Methods:**

None.

**toJSON Output:**

Gauges directly return their currently value.

### Counter

Things that increment or decrement. Example:

```js
import { metrics } from 'node-measured-es';
const activeUploads = new metrics.Counter();
http.createServer(function(req, res) {
  activeUploads.inc();
  req.on('end', function() {
    activeUploads.dec();
  });
});
```

**Options:**

* `count` An initial count for the counter. Defaults to `0`.

**Methods:**

* `inc(n)` Increment the counter by `n`. Defaults to `1`.
* `dec(n)` Decrement the counter by `n`. Defaults to `1`.
* `reset(count)` Resets the counter back to `count` Defaults to `0`.

**toJSON Output:**

Counters directly return their current value.

### Meter

Things that are measured as events / interval. Example:

```js
import { metrics } from 'node-measured-es')
const meter = new metrics.Meter();
http.createServer((req, res) => {
  meter.mark();
});
```

**Options:**

* `rateUnit` The rate unit. Defaults to `1000` (1 sec).
* `tickInterval` The interval in which the averages are updated. Defaults to
  `5000` (5 sec).

**Methods:**

* `mark(n)` Register `n` events as having just occured. Defaults to `1`.
* `reset()` Resets all values. Meters initialized with custom options will
  be reset to the default settings (patch welcome).
* `unref()` Unrefs the backing timer.  The meter will not keep the event loop
  alive.  Idempotent.
* `ref()` Refs the backing timer again.  Idempotent.

**toJSON Output:**

* `mean`: The average rate since the meter was started.
* `count`: The total of all values added to the meter.
* `currentRate`: The rate of the meter since the last toJSON() call.
* `rate1Min`: The rate of the meter biased towards the last 1 minute.
* `rate5Min`: The rate of the meter biased towards the last 5 minutes.
* `rate15Min`: The rate of the meter biased towards the last 15 minutes.

### Histogram

Keeps a resevoir of statistically relevant values biased towards the last 5
minutes to explore their distribution. Example:

```js
import { metrics } from 'node-measured-es';
const histogram = new metrics.Histogram();
http.createServer((req, res) => {
  if (req.headers['content-length']) {
    histogram.update(parseInt(req.headers['content-length'], 10));
  }
});
```

**Options:**

* `sample` The sample resevoir to use. Defaults to an `ExponentiallyDecayingSample`.

**Methods:**

* `update(value, timestamp)` Pushes `value` into the sample. `timestamp`
  defaults to `Date.now()`.
* `hasValues()` Whether the histogram contains values.
* `reset()` Resets all values. Histograms initialized with custom options will
  be reset to the default settings (patch welcome).

**toJSON Output:**

* `min`: The lowest observed value.
* `max`: The highest observed value.
* `sum`: The sum of all observed values.
* `variance`: The variance of all observed values.
* `mean`: The average of all observed values.
* `stddev`: The stddev of all observed values.
* `count`: The number of observed values.
* `median`: 50% of all values in the resevoir are at or below this value.
* `p75`: See median, 75% percentile.
* `p95`: See median, 95% percentile.
* `p99`: See median, 99% percentile.
* `p999`: See median, 99.9% percentile.

### Timers

Timers are a combination of Meters and Histograms. They measure the rate as
well as distribution of scalar events. Since they are frequently used for
tracking how long certain things take, they expose an API for that:

```js
import { metrics } from 'node-measured-es';
const timer = new metrics.Timer();
http.createServe((req, res) => {
  var stopwatch = timer.start();
  req.on('end', function() {
    stopwatch.end();
  });
});
```

But you can also use them as generic histograms that also track the rate of
events:

```js
import { metrics } from 'node-measured-es';
const timer = new metrics.Timer();
http.createServer((req, res) => {
  if (req.headers['content-length']) {
    timer.update(parseInt(req.headers['content-length'], 10));
  }
});
```

**Options:**

* `meter` The internal meter to use. Defaults to a new `Meter`.
* `histogram` The internal histogram to use. Defaults to a new `Histogram`.

**Methods:**

* `start()` Returns a `Stopwatch`.
* `update(value)` Updates the internal histogram with `value` and marks one
  event on the internal meter.
* `reset()` Resets all values. Timers initialized with custom options will
  be reset to the default settings (patch welcome).
* `unref()` Unrefs the backing timer.  The internal meter will not keep the event loop
  alive. Idempotent.
* `ref()` Refs the backing timer again. Idempotent.

**toJSON Output:**

* `meter`: See Meter toJSON output docs above.
* `histogram`: See Histogram toJSON output docs above.

## License

This module is licensed under the MIT license.
