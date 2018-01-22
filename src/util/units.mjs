/* @flow */
// Time units, as found in Java:
// http://download.oracle.com/
//   javase/6/docs/api/java/util/concurrent/TimeUnit.html
export const NANOSECONDS = (1 / (1000 * 1000));
export const MICROSECONDS = 1 / 1000;
export const MILLISECONDS = 1;
export const SECONDS = 1000 * MILLISECONDS;
export const MINUTES = 60 * SECONDS;
export const HOURS = 60 * MINUTES;
export const DAYS = 24 * HOURS;
