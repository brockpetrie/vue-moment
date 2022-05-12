import momentFilter from './core/momentFilter';
import durationFilter from './core/durationFilter';

module.exports = {
  install(App, options) {
    const moment = options && options.moment ? options.moment : require('moment');

    if (parseInt(App.version, 4) >= 3) {
      App.config.globalProperties.moment = moment;
      App.config.globalProperties.$moment = (...args) => momentFilter(args, moment);
      App.config.globalProperties.$duration = (...args) => durationFilter(args, moment);
    } else {
      App.prototype.moment = moment;
      App.prototype.$moment = (...args) => momentFilter(args, moment);
      App.prototype.$duration = (...args) => durationFilter(args, moment);
    }

    App.moment = moment;
  },
};
