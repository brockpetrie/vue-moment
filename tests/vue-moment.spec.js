import Vue from 'vue/dist/vue'
import VueMoment from '../vue-moment'
import moment from 'moment-timezone'

Vue.use(VueMoment, {
    moment,
})

const now = moment()
const tomorrow = moment().add(1, 'day')

const vm = new Vue({
    template: '<div>{{ now | moment(...args) }}</div>',
    data() {
        return {
            now,
            args: [
                'YYYY-MM-DD',
            ],
        }
    },
}).$mount();



describe('VueMoment', () => {
    describe('installing plugin', () => {
        it('loads prototype', () => {
            expect(typeof vm.$moment).toEqual('function')
        })

        it('prototype works', () => {
            expect(vm.$moment(now).format('YYYY-MM-DD')).toEqual(now.format('YYYY-MM-DD'))
        })

        it('sets locale', () => {
            vm.$moment.locale('fr')
            expect(vm.$moment.locale()).toEqual('fr')
        })
    })

    describe('using filter', () => {
        it('formats date', () => {
            expect(vm.$el.textContent).toContain(now.format('YYYY-MM-DD'))
        })

        describe('relative dates', () => {
            it('simple', (done) => {
                vm.args = ['from']
                vm.$nextTick(() => {
                    expect(vm.$el.textContent).toContain('a few seconds ago')
                    done()
                })
            })

            it('change reference', (done) => {
                vm.args = ['from', tomorrow]
                vm.$nextTick(() => {
                    expect(vm.$el.textContent).toContain('a day ago')
                    done()
                })
            }) 

            it('remove prefix', (done) => {
                vm.args = ['from', tomorrow, true]
                vm.$nextTick(() => {
                    expect(vm.$el.textContent).toContain('a day')
                    done()
                })
            }) 
        })

        describe('calendar', () => {
            it('simple', (done) => {
                vm.args = ['calendar']
                vm.$nextTick(() => {
                    expect(vm.$el.textContent).toContain(now.calendar())
                    done()
                })
            }) 
        })

        describe('maths', () => {
            it('add', (done) => {
                vm.args = ['add', '1 day']
                vm.$nextTick(() => {
                    expect(vm.$el.textContent).toContain(now.clone().add(1, 'days').toISOString())
                    done()
                })
            }) 

            it('subtract', (done) => {
                vm.args = ['subtract', '1 day']
                vm.$nextTick(() => {
                    expect(vm.$el.textContent).toContain(now.clone().subtract(1, 'days').toISOString())
                    done()
                })
            }) 

            it('timezone', (done) => {
                vm.args = ['timezone', 'America/Los_Angeles', '']
                vm.$nextTick(() => {
                    expect(vm.$el.textContent).toContain(now.clone().tz('America/Los_Angeles').format())
                    done()
                })
            }) 
        })

        describe('chaining', () => {
            it('simple', (done) => {
                vm.args = ['add', '1 day', 'YYYY-MM-DD']
                vm.$nextTick(() => {
                    expect(vm.$el.textContent).toContain(now.clone().add(1, 'days').format('YYYY-MM-DD'))
                    done()
                })
            }) 
        })
    })

})