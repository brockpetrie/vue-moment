const duration = (args, moment) => {
  /*
   * Basic pass-through filter for leveraging moment.js's ability
   * to manipulate and display durations.
   * https://momentjs.com/docs/#/durations/
   */
  args = Array.prototype.slice.call(args);
  const input = args.shift();
  const method = args.shift();

  function createDuration(time) {
    if (!Array.isArray(time)) time = [time];
    const result = moment.duration(...time);
    if (!result.isValid()) console.warn('Could not build a valid `duration` object from input.');
    return result;
  }

  let duration = createDuration(input);

  if (method === 'add' || method === 'subtract') {
    // Generates a duration object and either adds or subtracts it
    // from our original duration.
    const durationChange = createDuration(args);
    duration[method](durationChange);
  } else if (duration && duration[method]) {
    // This gives a full proxy to moment.duration functions.
    duration = duration[method](...args);
  }

  return duration;
};

export default duration;
