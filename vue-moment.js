Vue.filter('moment', function() {
	var args = Array.prototype.slice.call(arguments),
		value = args.shift(),
		date = moment(value);

	if (!date.isValid()) return '';

	function parse() {
		var args = Array.prototype.slice.call(arguments).map(function(str) { return str.replace(/^("|')|("|')$/g, ''); }),
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
				if (args[0] == 'true') {
					args.shift();
					var removeSuffix = true;
				}

				if (from != 'now') {
					date = date.from(from, removeSuffix);
					break;
				}

				date = date.fromNow(removeSuffix);
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

		if (args.length) parse.apply(parse, args);
	}
	
	parse.apply(parse, args);


	return date;
});
