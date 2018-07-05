import moment from 'moment-timezone';
import Vue from 'vue/dist/vue';
import VueMoment from '../vue-moment';

Vue.use(VueMoment, {
  moment,
});

const now = moment();
const tomorrow = moment().add(1, 'day');
const period = 'P1D';

const vm = new Vue({
  template: '<div>{{ now | moment(...args) }}</div>',
  data() {
    return {
      now,
      args: [
        'YYYY-MM-DD',
      ],
    };
  },
}).$mount();

const vmd = new Vue({
  template: '<div>{{ period | duration(...args) | duration(...formatter) }}</div>',
  data() {
    return {
      period,
      args: [],
      formatter: ['humanize', true],
    };
  },
}).$mount();

describe('VueMoment', () => {
  describe('installing plugin', () => {
    it('loads prototype', () => {
      expect(typeof vm.$moment).toEqual('function');
    });

    it('prototype works', () => {
      expect(vm.$moment(now).format('YYYY-MM-DD')).toEqual(now.format('YYYY-MM-DD'));
    });

    it('sets locale', () => {
      vm.$moment.locale('fr');
      expect(vm.$moment.locale()).toEqual('fr');
      vm.$moment.locale('en');
    });
  });

  describe('using filter', () => {
    it('formats date', () => {
      expect(vm.$el.textContent).toContain(now.format('YYYY-MM-DD'));
    });

    describe('relative dates', () => {
      describe('from', () => {
        it('simple', (done) => {
          vm.args = ['from'];
          vm.$nextTick(() => {
            expect(vm.$el.textContent).toContain('a few seconds ago');
            done();
          });
        });

        it('change reference', (done) => {
          vm.args = ['from', tomorrow];
          vm.$nextTick(() => {
            expect(vm.$el.textContent).toContain('a day ago');
            done();
          });
        });

        it('remove prefix', (done) => {
          vm.args = ['from', tomorrow, true];
          vm.$nextTick(() => {
            expect(vm.$el.textContent).toContain('a day');
            done();
          });
        });
      });

      describe('calendar', () => {
        it('simple', (done) => {
          vm.args = ['calendar'];
          vm.$nextTick(() => {
            expect(vm.$el.textContent).toContain(now.calendar());
            done();
          });
        });

        it('with options', (done) => {
          vm.args = ['calendar', tomorrow, { lastDay: '[Yesterday]' }];
          vm.$nextTick(() => {
            expect(vm.$el.textContent).toContain('Yesterday');
            done();
          });
        });
      });

      describe('diff', () => {
        it('simple', (done) => {
          vm.args = ['diff', tomorrow, 'hours'];
          vm.$nextTick(() => {
            expect(vm.$el.textContent).toContain('24');
            done();
          });
        });
      });
    });

    describe('mutations', () => {
      it('add', (done) => {
        vm.args = ['add', '1 day'];
        vm.$nextTick(() => {
          expect(vm.$el.textContent).toContain(now.clone().add(1, 'days').toISOString());
          done();
        });
      });

      it('subtract', (done) => {
        vm.args = ['subtract', '1 day'];
        vm.$nextTick(() => {
          expect(vm.$el.textContent).toContain(now.clone().subtract(1, 'days').toISOString());
          done();
        });
      });

      it('utc', (done) => {
        vm.args = ['utc'];
        vm.$nextTick(() => {
          expect(vm.$el.textContent).toContain(now.clone().utc().toISOString());
          done();
        });
      });

      it('timezone', (done) => {
        vm.args = ['timezone', 'America/Los_Angeles'];
        vm.$nextTick(() => {
          expect(vm.$el.textContent).toContain(now.clone().tz('America/Los_Angeles').toISOString());
          done();
        });
      });
    });

    describe('chaining', () => {
      it('simple', (done) => {
        vm.args = ['add', '2 days', 'subtract', '1 day', 'YYYY-MM-DD'];
        vm.$nextTick(() => {
          expect(vm.$el.textContent).toContain(now.clone().add(1, 'days').format('YYYY-MM-DD'));
          done();
        });
      });
    });

    describe('durations', () => {
      afterEach(() => {
        vmd.period = period;
        vmd.args = [];
        vmd.formatter = ['humanize', true];
      });

      it('simple humanize', (done) => {
        vmd.$nextTick(() => {
          expect(vmd.$el.textContent).toContain('in a day');
          done();
        });
      });

      it('add', (done) => {
        vmd.args = ['add', 'P1D'];
        vmd.$nextTick(() => {
          expect(vmd.$el.textContent).toContain('in 2 days');
          done();
        });
      });

      it('subtract', (done) => {
        vmd.args = ['subtract', 'P2D'];
        vmd.$nextTick(() => {
          expect(vmd.$el.textContent).toContain('a day ago');
          done();
        });
      });

      it('to string', (done) => {
        vmd.period = [5, 'days'];
        vmd.formatter = ['toISOString'];
        vmd.$nextTick(() => {
          expect(vmd.$el.textContent).toContain('P5D');
          done();
        });
      });

      it('getter', (done) => {
        vmd.formatter = ['asHours'];
        vmd.$nextTick(() => {
          expect(vmd.$el.textContent).toContain('24');
          done();
        });
      });
    });
  });

  describe('handle inputs', () => {
    beforeEach(() => {
      global.console.warn = jest.fn();
    });

    afterAll(() => {
      vm.now = moment();
    });

    it('handles string', (done) => {
      vm.now = '2017-01-01';
      vm.args = ['YYYY-MM-DD'];
      vm.$nextTick(() => {
        expect(console.warn).not.toBeCalled();
        expect(vm.$el.textContent).toContain('2017-01-01');
        done();
      });
    });

    it('handles numeric: seconds', (done) => {
      vm.now = 1484438400;
      vm.args = ['YYYY-MM'];
      vm.$nextTick(() => {
        expect(console.warn).not.toBeCalled();
        expect(vm.$el.textContent).toContain('2017-01');
        done();
      });
    });

    it('handles numeric: milliseconds', (done) => {
      vm.now = 1484438400000;
      vm.args = ['YYYY-MM'];
      vm.$nextTick(() => {
        expect(console.warn).not.toBeCalled();
        expect(vm.$el.textContent).toContain('2017-01');
        done();
      });
    });

    it('handles object', (done) => {
      vm.now = { y: 2017, m: 1, d: 1 };
      vm.args = ['YYYY-MM-DD'];
      vm.$nextTick(() => {
        expect(console.warn).not.toBeCalled();
        expect(vm.$el.textContent).toContain('2017-01-01');
        done();
      });
    });

    it('handles Date object', (done) => {
      vm.now = new Date(2017, 0, 1);
      vm.args = ['YYYY-MM-DD'];
      vm.$nextTick(() => {
        expect(console.warn).not.toBeCalled();
        expect(vm.$el.textContent).toContain('2017-01-01');
        done();
      });
    });

    it('handles Moment object', (done) => {
      vm.now = moment('2017-01-01');
      vm.args = ['YYYY-MM-DD'];
      vm.$nextTick(() => {
        expect(console.warn).not.toBeCalled();
        expect(vm.$el.textContent).toContain('2017-01-01');
        done();
      });
    });

    it('handles undefined', (done) => {
      vm.now = undefined;
      vm.$nextTick(() => {
        expect(console.warn).toBeCalled();
        done();
      });
    });

    it('handles invalid string', (done) => {
      vm.now = 'foo';
      vm.$nextTick(() => {
        expect(console.warn).toBeCalled();
        expect(vm.$el.textContent).toContain('foo');
        done();
      });
    });
  });
});
