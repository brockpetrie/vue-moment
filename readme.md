# vue-moment
[![npm version](https://badge.fury.io/js/vue-moment.svg)](https://badge.fury.io/js/vue-moment) [![Build Status](https://travis-ci.org/brockpetrie/vue-moment.svg?branch=master)](https://travis-ci.org/brockpetrie/vue-moment)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


Handy [Moment.js](http://www.momentjs.com) filters for your [Vue.js](http://vuejs.org/) project.

## Installation

Install via NPM...

```sh
$ npm install vue-moment
```

...and require the plugin like so:

```js
Vue.use(require('vue-moment'));
```

## Usage

Simply set `moment` as the filtering function and you're good to go. At least one argument is expected, which the filter assumes to be a `format` string if the argument doesn't match any of the other filtering methods.

```html
<span>{{ someDate | moment("dddd, MMMM Do YYYY") }}</span>
<!-- or create a new date from 'now' -->
<span>{{ new Date() | moment("dddd, MMMM Do YYYY") }}</span>
```

## Passing Your Date

Moment.js expects your input to be either: a valid ISO 8601 formatted string (see <http://momentjs.com/docs/#/parsing/string/>), a valid `Date` object, a Unix timestamp (in seconds, passed as a Number; if you'd like to pass milliseconds, send as a date object using `new Date(milliseconds)`), or a date string with an accompanying format pattern (i.e. when you know the format of the date input). For the latter, `vue-moment` allows you to pass your date and format pattern(s) as an array, like such:

```html
<span>{{ [ someDate, "MM.DD.YY" ] | moment("dddd, MMMM Do YYYY") }}</span>
<!-- or when you want to parse against more than one pattern -->
<span>{{ [ someDate, ["MM.DD.YY", "MM-DD-YY", "MM-DD-YYYY"] ] | moment("dddd, MMMM Do YYYY") }}</span>
```

As of 3.0.0, passing an empty or invalid input will no longer initiate moment with a new `Date` object fallback.

## Filtering Methods

### format (default)

This is the default filtering option. Formats the date against a string of tokens. See <http://momentjs.com/docs/#/displaying/format/> for a list of tokens and examples.

**Default**

```html
<span>{{ someDate | moment("YYYY") }}</span>
<!-- e.g. "2010" -->
<span>{{ someDate | moment("ddd, hA") }}</span>
<!-- e.g. "Sun, 3PM" -->
<span>{{ someDate | moment("dddd, MMMM Do YYYY, h:mm:ss a") }}</span>
<!-- e.g. "Sunday, February 14th 2010, 3:25:50 pm" -->
```

For more information about `moment#format`, check out <http://momentjs.com/docs/#/displaying/format/>.


### from

Display a moment in relative time, either from now or from a specified date.

**Default** (calculates from current time)

```html
<span>{{ someDate | moment("from", "now") }}</span>
<!-- or shorthanded -->
<span>{{ someDate | moment("from") }}</span>
```

**With a reference time given**

```html
<span>{{ someDate | moment("from", "Jan. 11th, 1985") }}</span>
```

**With suffix hidden** (e.g. '4 days ago' -> '4 days')

```html
<span>{{ someDate | moment("from", "now", true) }}</span>
<!-- or -->
<span>{{ someDate | moment("from", true) }}</span>
<!-- or with a reference time -->
<span>{{ someDate | moment("from", "Jan. 11th, 2000", true) }}</span>
```

For more information about `moment#fromNow` and `moment#from`, check out <http://momentjs.com/docs/#/displaying/fromnow/> and <http://momentjs.com/docs/#/displaying/from/>.


### calendar

Formats a date with different strings depending on how close to a certain date (today by default) the date is.

**Default** (calculates from current time)

```html
<span>{{ someDate | moment("calendar") }}</span>
<!-- e.g. "Last Monday 2:30 AM" -->
```

**With a reference time given**

```html
<span>{{ someDate | moment("calendar", "July 10 2011") }}</span>
<!-- e.g. "7/10/2011" -->
```

For more information about `moment#calendar`, check out <http://momentjs.com/docs/#/displaying/calendar-time/>.


### add

Mutates the original moment by adding time.

```html
<span>{{ someDate | moment("add", "7 days") }}</span>
<!-- or with multiple keys -->
<span>{{ someDate | moment("add", "1 year, 3 months, 30 weeks, 10 days") }}</span>
```

For more information about `moment#add`, check out <http://momentjs.com/docs/#/manipulating/add/>.


### subtract

Works the same as `add`, but mutates the original moment by subtracting time.

```html
<span>{{ someDate | moment("subtract", "3 hours") }}</span>
```

For more information about `moment#subtract`, check out <http://momentjs.com/docs/#/manipulating/subtract/>.

### timezone

Convert the date to a certain timezone

```html
<span>{{ date | moment('timezone', 'America/Los_Angeles', 'LLLL ss')}}</span>
```

**To use this filter you will need to pass `moment-timezone` through to the plugin**

```js
// main.js
import Vue from 'vue'
import VueMoment from 'vue-moment'
import moment from 'moment-timezone'

Vue.use(VueMoment, {
    moment,
})
```

For more information about `moment#timezone`, check out <https://momentjs.com/timezone/docs/#/using-timezones/converting-to-zone/>.


## Chaining

There's some built-in (and not thoroughly tested) support for chaining, like so:

```html
<span>{{ someDate | moment("add", "2 years, 8 days", "subtract", "3 hours", "ddd, hA") }}</span>
```

This would add 2 years and 8 months to the date, then subtract 3 hours, then format the resulting date.


## Configuration

`vue-moment` should respect any global Moment customizations, including i18n locales. For more info, check out <http://momentjs.com/docs/#/customization/>.

You can also pass a custom Moment object through with the plugin options. This technique is especially useful for overcoming the browserify locale bug demonstrated in the docs <http://momentjs.com/docs/#/use-it/browserify/>

```js
const moment = require('moment')
require('moment/locale/es')

Vue.use(require('vue-moment'), {
    moment
})

console.log(Vue.moment().locale()) //es
```
