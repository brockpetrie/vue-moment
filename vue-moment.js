var moment = require('moment');

module.exports = {
	install: function (Vue, options) {
		Object.defineProperties(Vue.prototype, {
			$moment: {
				get: function() {
					return Vue.moment.bind(this);
				},
			},
		});

		if (options && options.moment) {
			moment = options.moment
		}

		Vue.moment = function(data) {
			return moment(data);
		}

		Vue.filter('moment', function() {
			this.args = Array.prototype.slice.call(arguments);
			this.date = null;

			getDate.apply(this);
			parse.apply(this, args);

			return this.date;
		});

		Vue.filter('moment.tz', function() {
			this.args = Array.prototype.slice.call(arguments);
			this.date = null;

			var timezone = this.args.pop();
			getDate.apply(this);

			this.date.tz(timezone)

			parse.apply(this, args);
			return this.date;
		})

		function getDate() {
			var args = this.args;
			input = args.shift();

			if (Array.isArray(input) && typeof input[0] === 'string') {
				// If input is array, assume we're being passed a format pattern to parse against.
				// Format pattern will accept an array of potential formats to parse against.
				// Date string should be at [0], format pattern(s) should be at [1]
				this.date = moment(string = input[0], formats = input[1], true);
			} else {
				// Otherwise, throw the input at moment and see what happens...
				this.date = moment(input);
			}

			if (!this.date.isValid()) {
				// Log a warning if moment couldn't reconcile the input. Better than throwing an error?
				console.warn('Could not build a valid `moment` object from input.');
				throw "Error parsing date";
			}
		}

		function parse() {

			var date = this.date;
			var args = Array.prototype.slice.call(arguments),
				method = args.shift();

			switch (method) {
				case 'add':

					// Mutates the original moment by adding time.
					// http://momentjs.com/docs/#/manipulating/add/

					var addends = args.shift()
									  .split(',')
									  .map(Function.prototype.call, String.prototype.trim);
					obj = {};
					for (var n = 0; n < addends.length; n++) {
						var addend = addends[n].split(' ');
						obj[addend[1]] = addend[0];
					}
					date = date.add(obj);
					break;

				case 'subtract':

					// Mutates the original moment by subtracting time.
					// http://momentjs.com/docs/#/manipulating/subtract/

					var subtrahends = args.shift()
									  .split(',')
									  .map(Function.prototype.call, String.prototype.trim);
					obj = {};
					for (var n = 0; n < subtrahends.length; n++) {
						var subtrahend = subtrahends[n].split(' ');
						obj[subtrahend[1]] = subtrahend[0];
					}
					date = date.subtract(obj);
					break;

				case 'from':

					// Display a moment in relative time, either from now or from a specified date.
					// http://momentjs.com/docs/#/displaying/fromnow/

					var from = 'now';
					if (args[0] == 'now') args.shift();

					if (moment(args[0]).isValid()) {
						// If valid, assume it is a date we want the output computed against.
						from = moment(args.shift());
					}

					var removeSuffix = false;
					if (args[0] === true) {
						args.shift();
						var removeSuffix = true;
					}

					if (from != 'now') {
						date = date.from(from, removeSuffix);
						break;
					}

					date = date.fromNow(removeSuffix);
					break;

				case 'diff':

					// Mutates the original moment by doing a difference with another date.
					// http://momentjs.com/docs/#/displaying/difference/

					var dateDiff = 'now';
					if (args[0] == 'now') args.shift();

					if (moment(args[0]).isValid()) {
						dateDiff = moment(args.shift());
					}

					var units = '';
					if (args[0]) {
						var units = args.shift();
					}

					var floatingValue = false;
					if (args[0] === true) {
						args.shift();
						var floatingValue = true;
					}

					date = date.diff(dateDiff, units, floatingValue)
					break;

				case 'calendar':

					// Formats a date with different strings depending on how close to a certain date (today by default) the date is.
					// http://momentjs.com/docs/#/displaying/calendar-time/

					var referenceTime = moment();

					if (moment(args[0]).isValid()) {
						// If valid, assume it is a date we want the output computed against.
						referenceTime = moment(args.shift());
					}

					date = date.calendar(referenceTime);
					break;

				default:
					// Format
					// Formats a date by taking a string of tokens and replacing them with their corresponding values.
					// http://momentjs.com/docs/#/displaying/format/
					var format = method;
					date = date.format(format);
			}

			this.date = date;
			if (args.length) parse.apply(parse, args);
		}
	},
};
