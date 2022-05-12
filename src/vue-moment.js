import momentFilter from './core/momentFilter';
import durationFilter from './core/durationFilter';

module.exports = {
  install(App, options) {
    const moment = options && options.moment ? options.moment : require('moment');

    if (parseInt(App.version, 4) >= 3) {
      App.config.globalProperties.$moment = {
        get() {
          return moment;
        },
      };

      App.config.globalProperties.$filters = {
        moment: (...args) => momentFilter(args, moment),
        duration: (...args) => durationFilter(args, moment),
      };
    } else {
      Object.defineProperties(App.prototype, {
        $moment: {
          get() {
            return moment;
          },
        },
      });

      App.filter('moment', (...args) => momentFilter(args, moment));
      App.filter('duration', (...args) => durationFilter(args, moment));
    }

    App.moment = moment;
  },
};
